<?php

namespace App\Models;

use Throwable;

class User extends Model
{
    protected string $table = 'usuarios';

    public function findByEmail(string $email): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM usuarios WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    public function findByLogin(string $identifier): ?array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM usuarios
             WHERE email = :email OR (rol = \'admin\' AND nombre = :nombre)
             ORDER BY CASE WHEN email = :email_order THEN 0 ELSE 1 END
             LIMIT 1'
        );
        $statement->execute([
            'email' => $identifier,
            'nombre' => $identifier,
            'email_order' => $identifier,
        ]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    public function countActiveAdmins(): int
    {
        $statement = $this->db->query("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin' AND estado = 'activo'");

        return (int) $statement->fetchColumn();
    }

    public function activeAdmins(): array
    {
        $statement = $this->db->query(
            "SELECT id, nombre, email, created_at FROM usuarios WHERE rol = 'admin' AND estado = 'activo' ORDER BY nombre"
        );

        return $statement->fetchAll();
    }

    public function createAdmin(string $name, string $email, string $password): void
    {
        $statement = $this->db->prepare(
            "INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (:nombre, :email, :password, 'admin', 'activo')"
        );
        $statement->execute([
            'nombre' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
        ]);
    }

    /** Crea la cuenta y su perfil de paciente en una sola transacción. */
    public function createPatientAccount(string $name, string $email, string $password): int
    {
        $this->db->beginTransaction();

        try {
            $statement = $this->db->prepare(
                "INSERT INTO usuarios (nombre, email, password, rol, estado)
                 VALUES (:nombre, :email, :password, 'paciente', 'activo')"
            );
            $statement->execute([
                'nombre' => $name,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_DEFAULT),
            ]);
            $userId = (int) $this->db->lastInsertId();

            $patient = $this->db->prepare('INSERT INTO pacientes (usuario_id) VALUES (:usuario_id)');
            $patient->execute(['usuario_id' => $userId]);

            $this->db->commit();

            return $userId;
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $error;
        }
    }

    /** Crea una cuenta médica y su perfil profesional en una sola transacción. */
    public function createDoctorAccount(
        string $name,
        string $email,
        string $password,
        string $license,
        string $specialty,
        string $phone
    ): int {
        $this->db->beginTransaction();

        try {
            $statement = $this->db->prepare(
                "INSERT INTO usuarios (nombre, email, password, rol, estado)
                 VALUES (:nombre, :email, :password, 'medico', 'activo')"
            );
            $statement->execute([
                'nombre' => $name,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_DEFAULT),
            ]);
            $userId = (int) $this->db->lastInsertId();

            $doctor = $this->db->prepare(
                'INSERT INTO medicos (usuario_id, cedula_profesional, especialidad, telefono)
                 VALUES (:usuario_id, :cedula, :especialidad, :telefono)'
            );
            $doctor->execute([
                'usuario_id' => $userId,
                'cedula' => $license,
                'especialidad' => $specialty,
                'telefono' => $phone !== '' ? $phone : null,
            ]);

            $this->db->commit();

            return $userId;
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $error;
        }
    }
}
