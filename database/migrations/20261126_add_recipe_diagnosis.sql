SET @has_diagnostico := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'recetas' AND COLUMN_NAME = 'diagnostico'
);
SET @ddl := IF(@has_diagnostico = 0,
  'ALTER TABLE recetas ADD COLUMN diagnostico VARCHAR(255) NULL AFTER consulta_id',
  'SELECT 1'
);
PREPARE clinibox_ddl FROM @ddl;
EXECUTE clinibox_ddl;
DEALLOCATE PREPARE clinibox_ddl;