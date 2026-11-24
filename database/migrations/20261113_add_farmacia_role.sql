-- Ejecutar una sola vez si la tabla usuarios ya existe en la base clinibox.
ALTER TABLE usuarios
    MODIFY rol ENUM('admin', 'medico', 'paciente', 'farmacia') NOT NULL;
