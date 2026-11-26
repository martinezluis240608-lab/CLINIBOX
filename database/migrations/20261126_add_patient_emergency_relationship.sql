SET @has_parentesco := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pacientes' AND COLUMN_NAME = 'contacto_emergencia_parentesco'
);
SET @ddl := IF(@has_parentesco = 0,
  'ALTER TABLE pacientes ADD COLUMN contacto_emergencia_parentesco VARCHAR(80) NULL AFTER contacto_emergencia_telefono',
  'SELECT 1'
);
PREPARE clinibox_ddl FROM @ddl;
EXECUTE clinibox_ddl;
DEALLOCATE PREPARE clinibox_ddl;