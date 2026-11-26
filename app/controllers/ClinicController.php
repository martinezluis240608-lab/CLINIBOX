<?php

namespace App\Controllers;

use App\Config\Database;
use App\Core\Controller;
use DateTimeImmutable;
use PDO;
use Throwable;

/** Operaciones clínicas persistentes y acotadas al usuario autenticado. */
class ClinicController extends Controller
{
    public function api(): void
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, private');

        try {
            $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
            $resource = (string) ($_GET['resource'] ?? '');
            if ($method === 'GET' && $resource === 'csrf') {
                echo json_encode(['token' => $this->csrfToken()]);
                return;
            }

            if ($method === 'GET' && $resource === 'doctors') {
                $rows = Database::connection()->query(
                    "SELECT m.id, u.nombre AS name, m.especialidad AS specialty,
                            m.consultorio AS office, m.biografia AS bio
                     FROM medicos m JOIN usuarios u ON u.id=m.usuario_id
                     WHERE u.estado='activo' ORDER BY u.nombre"
                )->fetchAll();
                $this->json(['doctors' => $rows]);
                return;
            }

            $user = \auth_user();
            if (!$user || empty($user['id'])) {
                $this->json(['error' => 'Inicia sesión para consultar o guardar información clínica.'], 401);
                return;
            }

            if ($method === 'GET') {
                $this->getResource($resource, (int) $user['id'], (string) \auth_role());
                return;
            }

            if ($method !== 'POST') {
                $this->json(['error' => 'Método no permitido.'], 405);
                return;
            }

            $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            if (!is_string($token) || !hash_equals($this->csrfToken(), $token)) {
                $this->json(['error' => 'La sesión venció. Recarga la página e inténtalo de nuevo.'], 419);
                return;
            }

            $payload = json_decode(file_get_contents('php://input') ?: '{}', true);
            if (!is_array($payload)) {
                $this->json(['error' => 'La solicitud no contiene datos válidos.'], 400);
                return;
            }

            $this->saveResource((string) ($payload['action'] ?? ''), $payload, (int) $user['id'], (string) \auth_role());
        } catch (\InvalidArgumentException $error) {
            $this->json(['error' => $error->getMessage()], 422);
        } catch (\DomainException $error) {
            $this->json(['error' => $error->getMessage()], 403);
        } catch (Throwable $error) {
            error_log('CliniBox clinic DB: ' . $error->getMessage());
            $this->json(['error' => 'No se pudo guardar o consultar la información clínica. Revisa la conexión con la base de datos.'], 500);
        }
    }

    private function getResource(string $resource, int $userId, string $role): void
    {
        $db = Database::connection();
        $doctorId = $role === 'medico' ? $this->doctorId($db, $userId) : 0;
        $patientId = $role === 'paciente' ? $this->patientId($db, $userId) : 0;

        switch ($resource) {
            case 'doctors':
                $this->requireRoleName($role, ['paciente']);
                $rows = $db->query(
                    "SELECT m.id, u.nombre AS name, m.especialidad AS specialty, m.consultorio AS office
                     FROM medicos m JOIN usuarios u ON u.id = m.usuario_id
                     WHERE u.estado = 'activo' ORDER BY u.nombre"
                )->fetchAll();
                $this->json(['doctors' => $rows]);
                return;

            case 'patients':
                $this->requireRoleName($role, ['medico']);
                $rows = $db->query(
                    "SELECT p.id, u.nombre AS name, p.telefono AS phone, u.email AS email,
                            (SELECT DATE(c.fecha_hora) FROM consultas c WHERE c.paciente_id=p.id AND c.medico_id=" . $doctorId . " ORDER BY c.fecha_hora DESC LIMIT 1) AS last_visit,
                            CONCAT('P-', LPAD(p.id, 6, '0')) AS exp
                     FROM pacientes p JOIN usuarios u ON u.id=p.usuario_id
                     WHERE u.estado='activo'
                       AND EXISTS (SELECT 1 FROM consultas c WHERE c.paciente_id=p.id AND c.medico_id=" . $doctorId . " AND c.estado<>'cancelada')
                     ORDER BY u.nombre"
                )->fetchAll();
                $this->json(['patients' => $rows]);
                return;

            case 'appointments':
            case 'consultations':
                if ($role === 'medico') {
                    $statement = $db->prepare(
                        "SELECT c.id, c.paciente_id, u.nombre AS patient,
                                CONCAT('P-', LPAD(p.id, 6, '0')) AS exp,
                                DATE_FORMAT(c.fecha_hora, '%Y-%m-%d') AS date,
                                DATE_FORMAT(c.fecha_hora, '%H:%i') AS time,
                                c.motivo AS reason,
                                IF(c.tipo='virtual','Virtual','Presencial') AS type,
                                CASE c.estado WHEN 'solicitada' THEN 'Programada' WHEN 'confirmada' THEN 'Confirmada' WHEN 'en_curso' THEN 'En atención' WHEN 'finalizada' THEN 'Completada' WHEN 'no_asistio' THEN 'No asistió' ELSE 'Cancelada' END AS status,
                                c.diagnostico AS diagnosis, c.notas
                         FROM consultas c JOIN pacientes p ON p.id=c.paciente_id JOIN usuarios u ON u.id=p.usuario_id
                         WHERE c.medico_id=:doctor ORDER BY c.fecha_hora DESC"
                    );
                    $statement->execute(['doctor' => $doctorId]);
                } elseif ($role === 'paciente') {
                    $statement = $db->prepare(
                        "SELECT c.id, c.paciente_id, c.medico_id AS doctorId, u.nombre AS doctor, m.especialidad AS specialty,
                                DATE_FORMAT(c.fecha_hora, '%Y-%m-%d') AS date,
                                DATE_FORMAT(c.fecha_hora, '%H:%i') AS time,
                                c.motivo AS reason,
                                CASE c.estado WHEN 'solicitada' THEN 'Solicitada' WHEN 'confirmada' THEN 'Confirmada' WHEN 'en_curso' THEN 'En atención' WHEN 'finalizada' THEN 'Finalizada' WHEN 'no_asistio' THEN 'No asistió' ELSE 'Cancelada' END AS status
                         FROM consultas c JOIN medicos m ON m.id=c.medico_id JOIN usuarios u ON u.id=m.usuario_id
                         WHERE c.paciente_id=:patient ORDER BY c.fecha_hora DESC"
                    );
                    $statement->execute(['patient' => $patientId]);
                } else {
                    $this->requireRoleName($role, ['medico', 'paciente']);
                    return;
                }
                $rows = $statement->fetchAll();
                $this->json([$resource => $rows]);
                return;

            case 'records':
                $this->requireRoleName($role, ['medico']);
                $statement = $db->prepare(
                    "SELECT e.id, e.paciente_id AS patientId, u.nombre AS patient,
                            CONCAT('P-', LPAD(p.id, 6, '0')) AS exp, DATE(e.registrado_en) AS date,
                            e.tipo_registro AS type, e.titulo AS diagnosis, e.contenido AS notes
                     FROM expedientes_clinicos e JOIN pacientes p ON p.id=e.paciente_id
                     JOIN usuarios u ON u.id=p.usuario_id WHERE e.medico_id=:doctor ORDER BY e.registrado_en DESC"
                );
                $statement->execute(['doctor' => $doctorId]);
                $this->json(['records' => $statement->fetchAll()]);
                return;

            case 'prescriptions':
                if ($role === 'medico') {
                    $statement = $db->prepare(
                        "SELECT r.id, r.paciente_id AS patientId, u.nombre AS patient,
                                CONCAT('RX-', LPAD(r.id, 6, '0')) AS folio,
                                DATE(r.fecha_emision) AS date, r.indicaciones AS medications,
                                r.estado AS status, r.diagnostico AS diagnosis
                         FROM recetas r JOIN pacientes p ON p.id=r.paciente_id JOIN usuarios u ON u.id=p.usuario_id
                         WHERE r.medico_id=:doctor ORDER BY r.fecha_emision DESC"
                    );
                    $statement->execute(['doctor' => $doctorId]);
                } elseif ($role === 'paciente') {
                    $statement = $db->prepare(
                        "SELECT r.id, u.nombre AS doctor, DATE(r.fecha_emision) AS date, r.indicaciones AS medications, r.estado AS status, r.diagnostico AS diagnosis
                         FROM recetas r JOIN medicos m ON m.id=r.medico_id JOIN usuarios u ON u.id=m.usuario_id
                         WHERE r.paciente_id=:patient ORDER BY r.fecha_emision DESC"
                    );
                    $statement->execute(['patient' => $patientId]);
                } else {
                    $this->requireRoleName($role, ['medico', 'paciente']);
                    return;
                }
                $this->json(['prescriptions' => $statement->fetchAll()]);
                return;

            case 'profile':
                if ($role === 'medico') {
                    $statement = $db->prepare(
                        'SELECT u.nombre AS name,u.email AS email,m.cedula_profesional AS license,
                                m.especialidad AS specialty,m.telefono AS phone,m.consultorio AS office,m.biografia AS bio
                         FROM usuarios u JOIN medicos m ON m.usuario_id=u.id WHERE u.id=:user'
                    );
                } elseif ($role === 'paciente') {
                    $statement = $db->prepare(
                        'SELECT u.nombre AS name,u.email AS email,p.telefono AS phone,p.direccion AS address,
                                p.contacto_emergencia_nombre AS emergency_name,
                                p.contacto_emergencia_telefono AS emergency_phone,
                                p.contacto_emergencia_parentesco AS emergency_relationship
                         FROM usuarios u JOIN pacientes p ON p.usuario_id=u.id WHERE u.id=:user'
                    );
                } else {
                    $this->requireRoleName($role, ['medico', 'paciente']);
                    return;
                }
                $statement->execute(['user' => $userId]);
                $this->json(['profile' => $statement->fetch() ?: []]);
                return;

            case 'messages':
                if ($role === 'medico') {
                    $statement = $db->prepare(
                        "SELECT ms.id, ms.paciente_id AS patientId, u.nombre AS patient, ms.contenido AS text,
                                ms.created_at AS sentAt, IF(ms.remitente_usuario_id=:user,'doctor','patient') AS sender
                         FROM mensajes ms JOIN pacientes p ON p.id=ms.paciente_id JOIN usuarios u ON u.id=p.usuario_id
                         WHERE ms.medico_id=:doctor ORDER BY ms.created_at"
                    );
                    $statement->execute(['user' => $userId, 'doctor' => $doctorId]);
                } elseif ($role === 'paciente') {
                    $statement = $db->prepare(
                        "SELECT ms.id, ms.medico_id AS doctorId, u.nombre AS doctor, ms.contenido AS text,
                                ms.created_at AS sentAt, IF(ms.remitente_usuario_id=:user,'patient','doctor') AS sender
                         FROM mensajes ms JOIN medicos m ON m.id=ms.medico_id JOIN usuarios u ON u.id=m.usuario_id
                         WHERE ms.paciente_id=:patient ORDER BY ms.created_at"
                    );
                    $statement->execute(['user' => $userId, 'patient' => $patientId]);
                } else {
                    $this->requireRoleName($role, ['medico', 'paciente']);
                    return;
                }
                $this->json(['messages' => $statement->fetchAll()]);
                return;

            default:
                $this->json(['error' => 'Recurso no reconocido.'], 404);
        }
    }

    private function saveResource(string $action, array $data, int $userId, string $role): void
    {
        $db = Database::connection();
        switch ($action) {
            case 'appointment':
                $this->requireRoleName($role, ['medico', 'paciente']);
                $dateTime = $this->dateTime($data['date'] ?? '', $data['time'] ?? '');
                $reason = $this->requiredText($data['reason'] ?? '', 'Indica el motivo de la cita.', 255);
                $doctorId = $role === 'medico' ? $this->doctorId($db, $userId) : (int) ($data['doctor_id'] ?? 0);
                $patientId = $role === 'paciente' ? $this->patientId($db, $userId) : (int) ($data['patient_id'] ?? 0);
                $this->assertEntity($db, 'medicos', $doctorId);
                $this->assertEntity($db, 'pacientes', $patientId);
                $type = stripos((string) ($data['type'] ?? ''), 'virtual') !== false ? 'virtual' : 'presencial';
                $state = $role === 'medico' ? 'confirmada' : 'solicitada';
                $this->ensureNoAppointmentConflict($db, $doctorId, $dateTime);
                $statement = $db->prepare('INSERT INTO consultas (paciente_id,medico_id,fecha_hora,tipo,motivo,estado) VALUES (:patient,:doctor,:date,:type,:reason,:state)');
                $statement->execute(['patient' => $patientId, 'doctor' => $doctorId, 'date' => $dateTime, 'type' => $type, 'reason' => $reason, 'state' => $state]);
                $this->json(['id' => (int) $db->lastInsertId(), 'status' => $state], 201);
                return;

            case 'consultation':
                $this->requireRoleName($role, ['medico']);
                $doctorId = $this->doctorId($db, $userId);
                $patientId = (int) ($data['patient_id'] ?? 0);
                $this->assertEntity($db, 'pacientes', $patientId);
                $dateTime = $this->dateTime($data['date'] ?? '', $data['time'] ?? '');
                $reason = $this->requiredText($data['reason'] ?? '', 'Indica el motivo de la consulta.', 255);
                $type = stripos((string) ($data['type'] ?? ''), 'virtual') !== false ? 'virtual' : 'presencial';
                $statusMap = ['Programada' => 'solicitada', 'Confirmada' => 'confirmada', 'En atención' => 'en_curso', 'Completada' => 'finalizada', 'Cancelada' => 'cancelada'];
                $statusValue = (string) ($data['status'] ?? 'Programada');
                if (!isset($statusMap[$statusValue])) throw new \InvalidArgumentException('Selecciona un estado válido.');
                $this->ensureNoAppointmentConflict($db, $doctorId, $dateTime);
                $statement = $db->prepare('INSERT INTO consultas (paciente_id,medico_id,fecha_hora,tipo,motivo,diagnostico,notas,estado) VALUES (:patient,:doctor,:date,:type,:reason,:diagnosis,:notes,:status)');
                $statement->execute([
                    'patient' => $patientId, 'doctor' => $doctorId, 'date' => $dateTime, 'type' => $type,
                    'reason' => $reason, 'diagnosis' => $this->optionalText($data['diagnosis'] ?? '', 65000),
                    'notes' => $this->optionalText($data['notes'] ?? '', 65000), 'status' => $statusMap[$statusValue],
                ]);
                $this->json(['id' => (int) $db->lastInsertId()], 201);
                return;

            case 'consultation_update':
                $this->requireRoleName($role, ['medico']);
                $doctorId = $this->doctorId($db, $userId);
                $id = (int) ($data['id'] ?? 0);
                $statusMap = ['Programada' => 'solicitada', 'Solicitada' => 'solicitada', 'Confirmada' => 'confirmada', 'En atención' => 'en_curso', 'Completada' => 'finalizada', 'Finalizada' => 'finalizada', 'Cancelada' => 'cancelada', 'No asistió' => 'no_asistio'];
                $statusValue = (string) ($data['status'] ?? '');
                if (!isset($statusMap[$statusValue])) throw new \InvalidArgumentException('Selecciona un estado válido para la consulta.');
                $status = $statusMap[$statusValue];
                $patientId = (int) ($data['patient_id'] ?? 0);
                $this->assertEntity($db, 'pacientes', $patientId);
                $dateTime = $this->dateTime($data['date'] ?? '', $data['time'] ?? '');
                $reason = $this->requiredText($data['reason'] ?? '', 'Indica el motivo de la consulta.', 255);
                $type = stripos((string) ($data['type'] ?? ''), 'virtual') !== false ? 'virtual' : 'presencial';
                $conflict = $db->prepare("SELECT COUNT(*) FROM consultas WHERE medico_id=:doctor AND fecha_hora=:date AND id<>:id AND estado NOT IN ('cancelada','no_asistio')");
                $conflict->execute(['doctor' => $doctorId, 'date' => $dateTime, 'id' => $id]);
                if ((int) $conflict->fetchColumn()) throw new \InvalidArgumentException('Ese horario ya está ocupado. Elige otra hora.');
                $statement = $db->prepare('UPDATE consultas SET paciente_id=:patient,fecha_hora=:date,tipo=:type,motivo=:reason,estado=:status,diagnostico=:diagnosis,notas=:notes WHERE id=:id AND medico_id=:doctor');
                $statement->execute(['patient' => $patientId, 'date' => $dateTime, 'type' => $type, 'reason' => $reason, 'status' => $status, 'diagnosis' => $this->optionalText($data['diagnosis'] ?? '', 65000), 'notes' => $this->optionalText($data['notes'] ?? '', 65000), 'id' => $id, 'doctor' => $doctorId]);
                if (!$statement->rowCount()) {
                    $this->assertOwnedConsultation($db, $id, $doctorId);
                }
                $this->json(['saved' => true]);
                return;

            case 'record':
                $this->requireRoleName($role, ['medico']);
                $doctorId = $this->doctorId($db, $userId);
                $patientId = (int) ($data['patient_id'] ?? 0);
                $this->assertEntity($db, 'pacientes', $patientId);
                $title = $this->requiredText($data['diagnosis'] ?? '', 'Indica el diagnóstico o título del expediente.', 180);
                $content = $this->requiredText($data['notes'] ?? '', 'Escribe la nota clínica.', 20000);
                $type = $this->optionalText($data['type'] ?? 'nota', 80) ?: 'nota';
                $dateTime = $this->dateTime($data['date'] ?? date('Y-m-d'), '12:00');
                $statement = $db->prepare('INSERT INTO expedientes_clinicos (paciente_id,medico_id,tipo_registro,titulo,contenido,registrado_en) VALUES (:patient,:doctor,:type,:title,:content,:date)');
                $statement->execute(['patient' => $patientId, 'doctor' => $doctorId, 'type' => $type, 'title' => $title, 'content' => $content, 'date' => $dateTime]);
                $this->json(['id' => (int) $db->lastInsertId()], 201);
                return;

            case 'prescription':
                $this->requireRoleName($role, ['medico']);
                $doctorId = $this->doctorId($db, $userId);
                $patientId = (int) ($data['patient_id'] ?? 0);
                $this->assertEntity($db, 'pacientes', $patientId);
                $medications = $this->requiredText($data['medications'] ?? '', 'Escribe la indicación de medicamentos.', 20000);
                $diagnosis = $this->requiredText($data['diagnosis'] ?? '', 'Indica el diagnóstico de la receta.', 255);
                $notes = $this->optionalText($data['notes'] ?? '', 20000);
                $status = in_array(($data['status'] ?? ''), ['activa', 'completada', 'cancelada'], true) ? $data['status'] : 'activa';
                $statement = $db->prepare('INSERT INTO recetas (paciente_id,medico_id,diagnostico,indicaciones,estado) VALUES (:patient,:doctor,:diagnosis,:instructions,:status)');
                $statement->execute(['patient' => $patientId, 'doctor' => $doctorId, 'diagnosis' => $diagnosis, 'instructions' => $medications . ($notes ? "\n\nIndicaciones: {$notes}" : ''), 'status' => $status]);
                $this->json(['id' => (int) $db->lastInsertId()], 201);
                return;

            case 'message':
                $this->requireRoleName($role, ['medico', 'paciente']);
                $patientId = $role === 'paciente' ? $this->patientId($db, $userId) : (int) ($data['patient_id'] ?? 0);
                $doctorId = $role === 'medico' ? $this->doctorId($db, $userId) : (int) ($data['doctor_id'] ?? 0);
                $this->assertEntity($db, 'pacientes', $patientId);
                $this->assertEntity($db, 'medicos', $doctorId);
                $content = $this->requiredText($data['text'] ?? '', 'Escribe el mensaje.', 20000);
                $this->assertConversation($db, $patientId, $doctorId);
                $statement = $db->prepare('INSERT INTO mensajes (paciente_id,medico_id,remitente_usuario_id,contenido) VALUES (:patient,:doctor,:sender,:content)');
                $statement->execute(['patient' => $patientId, 'doctor' => $doctorId, 'sender' => $userId, 'content' => $content]);
                $this->json(['id' => (int) $db->lastInsertId()], 201);
                return;

            case 'profile':
                $this->saveProfile($db, $data, $userId, $role);
                return;

            default:
                $this->json(['error' => 'Acción no reconocida.'], 400);
        }
    }

    private function saveProfile(PDO $db, array $data, int $userId, string $role): void
    {
        if ($role === 'medico') {
            $name = $this->requiredText($data['name'] ?? '', 'El nombre es obligatorio.', 160);
            $email = filter_var(strtolower(trim((string) ($data['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
            if (!$email || strlen($email) > 160) throw new \InvalidArgumentException('Escribe un correo válido.');
            $db->beginTransaction();
            try {
                $user = $db->prepare('UPDATE usuarios SET nombre=:name,email=:email WHERE id=:id');
                $user->execute(['name' => $name, 'email' => $email, 'id' => $userId]);
                $doctor = $db->prepare('UPDATE medicos SET cedula_profesional=:license,especialidad=:specialty,telefono=:phone,consultorio=:office,biografia=:bio WHERE usuario_id=:id');
                $doctor->execute([
                    'license' => $this->optionalText($data['license'] ?? '', 40),
                    'specialty' => $this->requiredText($data['specialty'] ?? '', 'La especialidad es obligatoria.', 120),
                    'phone' => $this->optionalText($data['phone'] ?? '', 30),
                    'office' => $this->optionalText($data['office'] ?? '', 120),
                    'bio' => $this->optionalText($data['bio'] ?? '', 65000), 'id' => $userId,
                ]);
                $db->commit();
            } catch (Throwable $error) {
                if ($db->inTransaction()) $db->rollBack();
                throw $error;
            }
        } elseif ($role === 'paciente') {
            $name = $this->requiredText($data['name'] ?? '', 'El nombre es obligatorio.', 160);
            $email = filter_var(strtolower(trim((string) ($data['email'] ?? ''))), FILTER_VALIDATE_EMAIL);
            if (!$email || strlen($email) > 160) throw new \InvalidArgumentException('Escribe un correo válido.');
            $user = $db->prepare('UPDATE usuarios SET nombre=:name,email=:email WHERE id=:id');
            $user->execute(['name' => $name, 'email' => $email, 'id' => $userId]);
            $patient = $db->prepare('UPDATE pacientes SET telefono=:phone,direccion=:address,contacto_emergencia_nombre=:emergency_name,contacto_emergencia_telefono=:emergency_phone,contacto_emergencia_parentesco=:emergency_relationship WHERE usuario_id=:id');
            $patient->execute([
                'phone' => $this->optionalText($data['phone'] ?? '', 30),
                'address' => $this->optionalText($data['address'] ?? '', 10000),
                'emergency_name' => $this->optionalText($data['emergency_name'] ?? '', 120),
                'emergency_phone' => $this->optionalText($data['emergency_phone'] ?? '', 30),
                'emergency_relationship' => $this->optionalText($data['emergency_relationship'] ?? '', 80), 'id' => $userId,
            ]);
        } else {
            $this->requireRoleName($role, ['medico', 'paciente']);
            return;
        }
        $this->json(['saved' => true]);
    }

    private function doctorId(PDO $db, int $userId): int
    {
        $statement = $db->prepare('SELECT id FROM medicos WHERE usuario_id=:id');
        $statement->execute(['id' => $userId]);
        $id = (int) $statement->fetchColumn();
        if (!$id) throw new \InvalidArgumentException('La cuenta no tiene perfil médico registrado.');
        return $id;
    }

    private function patientId(PDO $db, int $userId): int
    {
        $statement = $db->prepare('SELECT id FROM pacientes WHERE usuario_id=:id');
        $statement->execute(['id' => $userId]);
        $id = (int) $statement->fetchColumn();
        if (!$id) throw new \InvalidArgumentException('La cuenta no tiene perfil de paciente registrado.');
        return $id;
    }

    private function assertEntity(PDO $db, string $table, int $id): void
    {
        if (!in_array($table, ['medicos', 'pacientes'], true) || $id < 1) throw new \InvalidArgumentException('Selecciona un médico o paciente registrado.');
        $statement = $table === 'medicos'
            ? $db->prepare("SELECT COUNT(*) FROM medicos m JOIN usuarios u ON u.id=m.usuario_id WHERE m.id=:id AND u.estado='activo'")
            : $db->prepare("SELECT COUNT(*) FROM pacientes p JOIN usuarios u ON u.id=p.usuario_id WHERE p.id=:id AND u.estado='activo'");
        $statement->execute(['id' => $id]);
        if (!(int) $statement->fetchColumn()) throw new \InvalidArgumentException('No se encontró esa cuenta registrada.');
    }

    private function ensureNoAppointmentConflict(PDO $db, int $doctorId, string $dateTime): void
    {
        $statement = $db->prepare("SELECT COUNT(*) FROM consultas WHERE medico_id=:doctor AND fecha_hora=:date AND estado NOT IN ('cancelada','no_asistio')");
        $statement->execute(['doctor' => $doctorId, 'date' => $dateTime]);
        if ((int) $statement->fetchColumn()) throw new \InvalidArgumentException('Ese horario ya está ocupado. Elige otra hora.');
    }

    private function assertOwnedConsultation(PDO $db, int $id, int $doctorId): void
    {
        $statement = $db->prepare('SELECT COUNT(*) FROM consultas WHERE id=:id AND medico_id=:doctor');
        $statement->execute(['id' => $id, 'doctor' => $doctorId]);
        if (!(int) $statement->fetchColumn()) throw new \InvalidArgumentException('No se encontró esa consulta para este médico.');
    }

    private function assertConversation(PDO $db, int $patientId, int $doctorId): void
    {
        $statement = $db->prepare('SELECT COUNT(*) FROM consultas WHERE paciente_id=:patient AND medico_id=:doctor');
        $statement->execute(['patient' => $patientId, 'doctor' => $doctorId]);
        if (!(int) $statement->fetchColumn()) throw new \InvalidArgumentException('Solo puedes escribir a un médico con quien exista una cita registrada.');
    }

    private function dateTime(mixed $date, mixed $time): string
    {
        $value = trim((string) $date) . ' ' . trim((string) $time);
        $parsed = DateTimeImmutable::createFromFormat('!Y-m-d H:i', $value);
        $errors = DateTimeImmutable::getLastErrors();
        if (!$parsed || (is_array($errors) && ($errors['warning_count'] || $errors['error_count']))) {
            throw new \InvalidArgumentException('Indica una fecha y hora válidas.');
        }
        return $parsed->format('Y-m-d H:i:s');
    }

    private function requiredText(mixed $value, string $message, int $max): string
    {
        if (!is_string($value)) throw new \InvalidArgumentException($message);
        $value = trim(strip_tags($value));
        if ($value === '' || mb_strlen($value, 'UTF-8') > $max) throw new \InvalidArgumentException($message);
        return $value;
    }

    private function optionalText(mixed $value, int $max): ?string
    {
        if (!is_string($value)) return null;
        $value = trim(strip_tags($value));
        if ($value === '') return null;
        return mb_substr($value, 0, $max, 'UTF-8');
    }

    private function requireRoleName(string $role, array $allowed): void
    {
        if (!in_array($role, $allowed, true)) throw new \DomainException('No tienes permiso para esta acción.');
    }

    private function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    }
}
