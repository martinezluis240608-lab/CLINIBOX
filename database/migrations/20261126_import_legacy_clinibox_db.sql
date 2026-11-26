-- Migra cuentas y datos clínicos desde la base anterior `clinibox_db`.
-- Ejecutar una sola vez después de importar database/schema.sql.
-- Usa INSERT IGNORE para que no se dupliquen filas si se repite por error.

ALTER TABLE clinibox.pacientes
  MODIFY COLUMN direccion TEXT NULL,
  ADD COLUMN IF NOT EXISTS peso DECIMAL(6,2) NULL,
  ADD COLUMN IF NOT EXISTS altura DECIMAL(5,2) NULL,
  ADD COLUMN IF NOT EXISTS grupo_sanguineo VARCHAR(5) NULL,
  ADD COLUMN IF NOT EXISTS alergias TEXT NULL;

INSERT IGNORE INTO clinibox.usuarios
  (id, nombre, email, password, rol, estado, created_at)
SELECT id, name, email, password,
       CASE role
         WHEN 'patient' THEN 'paciente'
         WHEN 'doctor' THEN 'medico'
         WHEN 'admin' THEN 'admin'
         ELSE 'paciente'
       END,
       'activo', created_at
FROM clinibox_db.users;

INSERT IGNORE INTO clinibox.pacientes
  (id, usuario_id, fecha_nacimiento, sexo, telefono, direccion, peso, altura,
   grupo_sanguineo, alergias)
SELECT p.id, p.user_id, p.dob,
       CASE p.gender
         WHEN 'Femenino' THEN 'femenino'
         WHEN 'Masculino' THEN 'masculino'
         WHEN 'Otro' THEN 'otro'
         ELSE 'no_especificado'
       END,
       p.phone, p.address, p.weight, p.height, p.blood_type, p.allergies
FROM clinibox_db.patients p
INNER JOIN clinibox.usuarios u ON u.id = p.user_id;

INSERT IGNORE INTO clinibox.medicos
  (id, usuario_id, cedula_profesional, especialidad)
SELECT d.id, d.user_id, NULLIF(d.license_number, ''), d.specialty
FROM clinibox_db.doctors d
INNER JOIN clinibox.usuarios u ON u.id = d.user_id;

INSERT IGNORE INTO clinibox.consultas
  (id, paciente_id, medico_id, fecha_hora, tipo, motivo, notas, estado, created_at)
SELECT a.id, p.id, m.id, a.appointment_date, 'presencial',
       LEFT(COALESCE(NULLIF(TRIM(a.notes), ''), 'Consulta migrada'), 255), a.notes,
       CASE a.status
         WHEN 'Programada' THEN 'confirmada'
         WHEN 'Confirmada' THEN 'confirmada'
         WHEN 'Pendiente' THEN 'solicitada'
         WHEN 'Completada' THEN 'finalizada'
         WHEN 'Cancelada' THEN 'cancelada'
         ELSE 'solicitada'
       END,
       a.created_at
FROM clinibox_db.appointments a
INNER JOIN clinibox_db.patients old_patient ON old_patient.user_id = a.patient_id
INNER JOIN clinibox.pacientes p ON p.usuario_id = old_patient.user_id
INNER JOIN clinibox_db.doctors old_doctor ON old_doctor.user_id = a.doctor_id
INNER JOIN clinibox.medicos m ON m.usuario_id = old_doctor.user_id;

INSERT IGNORE INTO clinibox.expedientes_clinicos
  (id, paciente_id, medico_id, tipo_registro, titulo, contenido, registrado_en, created_at)
SELECT h.id, p.id, m.id, 'historia clínica migrada', 'Antecedente clínico',
       CONCAT_WS('\n', CONCAT('Diagnóstico: ', h.diagnosis), CONCAT('Tratamiento: ', h.treatment),
                 NULLIF(CONCAT('Notas: ', h.notes), 'Notas: ')),
       h.created_at, h.created_at
FROM clinibox_db.medical_histories h
INNER JOIN clinibox_db.patients old_patient ON old_patient.user_id = h.patient_id
INNER JOIN clinibox.pacientes p ON p.usuario_id = old_patient.user_id
INNER JOIN clinibox_db.doctors old_doctor ON old_doctor.user_id = h.doctor_id
INNER JOIN clinibox.medicos m ON m.usuario_id = old_doctor.user_id;
