-- CliniBox: esquema relacional para MySQL 8+ y MariaDB 10.4+.
-- Importar este archivo una vez desde phpMyAdmin o desde la consola de MySQL.
CREATE DATABASE IF NOT EXISTS `clinibox`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `clinibox`;

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Cuentas para pacientes, médicos, farmacia y administración.
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(160) NOT NULL,
  `email` VARCHAR(160) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('paciente','medico','farmacia','admin') NOT NULL,
  `estado` ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  `ultimo_acceso` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  KEY `idx_usuarios_rol_estado` (`rol`,`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `medicos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `cedula_profesional` VARCHAR(40) NULL,
  `especialidad` VARCHAR(120) NOT NULL DEFAULT 'Medicina general',
  `telefono` VARCHAR(30) NULL,
  `consultorio` VARCHAR(120) NULL,
  `biografia` TEXT NULL,
  `costo_consulta` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_medicos_usuario` (`usuario_id`),
  UNIQUE KEY `uq_medicos_cedula` (`cedula_profesional`),
  CONSTRAINT `fk_medicos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `curp` CHAR(18) NULL,
  `fecha_nacimiento` DATE NULL,
  `sexo` ENUM('femenino','masculino','otro','no_especificado') NOT NULL DEFAULT 'no_especificado',
  `telefono` VARCHAR(30) NULL,
  `direccion` TEXT NULL,
  `peso` DECIMAL(6,2) NULL,
  `altura` DECIMAL(5,2) NULL,
  `grupo_sanguineo` VARCHAR(5) NULL,
  `alergias` TEXT NULL,
  `contacto_emergencia_nombre` VARCHAR(120) NULL,
  `contacto_emergencia_telefono` VARCHAR(30) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pacientes_usuario` (`usuario_id`),
  UNIQUE KEY `uq_pacientes_curp` (`curp`),
  CONSTRAINT `fk_pacientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo compartido por la tienda, farmacia, recetas e inventario.
CREATE TABLE IF NOT EXISTS `productos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(60) NULL,
  `codigo_barras` VARCHAR(32) NULL,
  `nombre` VARCHAR(160) NOT NULL,
  `categoria` VARCHAR(120) NOT NULL,
  `descripcion` TEXT NULL,
  `emoji` VARCHAR(16) NOT NULL DEFAULT '💊',
  `precio` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock` INT UNSIGNED NOT NULL DEFAULT 0,
  `stock_minimo` INT UNSIGNED NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_productos_sku` (`sku`),
  UNIQUE KEY `uq_productos_codigo_barras` (`codigo_barras`),
  KEY `idx_productos_categoria_activo` (`categoria`,`activo`),
  KEY `idx_productos_stock` (`activo`,`stock`,`stock_minimo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agenda_medica` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `medico_id` BIGINT UNSIGNED NOT NULL,
  `fecha` DATE NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `estado` ENUM('disponible','reservada','bloqueada') NOT NULL DEFAULT 'disponible',
  `notas` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_agenda_horario_medico` (`medico_id`,`fecha`,`hora_inicio`),
  KEY `idx_agenda_fecha_estado` (`fecha`,`estado`),
  CONSTRAINT `fk_agenda_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `consultas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` BIGINT UNSIGNED NOT NULL,
  `medico_id` BIGINT UNSIGNED NOT NULL,
  `agenda_id` BIGINT UNSIGNED NULL,
  `fecha_hora` DATETIME NOT NULL,
  `tipo` ENUM('presencial','virtual') NOT NULL DEFAULT 'presencial',
  `motivo` VARCHAR(255) NOT NULL,
  `diagnostico` TEXT NULL,
  `notas` TEXT NULL,
  `estado` ENUM('solicitada','confirmada','en_curso','finalizada','cancelada','no_asistio') NOT NULL DEFAULT 'solicitada',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_consultas_paciente_fecha` (`paciente_id`,`fecha_hora`),
  KEY `idx_consultas_medico_fecha` (`medico_id`,`fecha_hora`),
  KEY `idx_consultas_estado` (`estado`),
  CONSTRAINT `fk_consultas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_consultas_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_consultas_agenda` FOREIGN KEY (`agenda_id`) REFERENCES `agenda_medica` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expedientes_clinicos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` BIGINT UNSIGNED NOT NULL,
  `medico_id` BIGINT UNSIGNED NOT NULL,
  `consulta_id` BIGINT UNSIGNED NULL,
  `tipo_registro` VARCHAR(80) NOT NULL DEFAULT 'nota',
  `titulo` VARCHAR(180) NOT NULL,
  `contenido` LONGTEXT NOT NULL,
  `registrado_en` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_expediente_paciente_fecha` (`paciente_id`,`registrado_en`),
  KEY `idx_expediente_medico` (`medico_id`),
  CONSTRAINT `fk_expedientes_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_expedientes_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_expedientes_consulta` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `recetas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` BIGINT UNSIGNED NOT NULL,
  `medico_id` BIGINT UNSIGNED NOT NULL,
  `consulta_id` BIGINT UNSIGNED NULL,
  `fecha_emision` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `indicaciones` TEXT NULL,
  `estado` ENUM('activa','completada','cancelada') NOT NULL DEFAULT 'activa',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recetas_paciente_fecha` (`paciente_id`,`fecha_emision`),
  KEY `idx_recetas_medico_fecha` (`medico_id`,`fecha_emision`),
  CONSTRAINT `fk_recetas_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_recetas_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_recetas_consulta` FOREIGN KEY (`consulta_id`) REFERENCES `consultas` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `receta_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `receta_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NULL,
  `medicamento` VARCHAR(180) NOT NULL,
  `dosis` VARCHAR(120) NOT NULL,
  `via_administracion` VARCHAR(80) NULL,
  `frecuencia` VARCHAR(120) NULL,
  `duracion` VARCHAR(120) NULL,
  `cantidad` VARCHAR(80) NULL,
  `instrucciones` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_receta_detalles_receta` (`receta_id`),
  KEY `idx_receta_detalles_producto` (`producto_id`),
  CONSTRAINT `fk_receta_detalles_receta` FOREIGN KEY (`receta_id`) REFERENCES `recetas` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_receta_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mensajes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` BIGINT UNSIGNED NOT NULL,
  `medico_id` BIGINT UNSIGNED NOT NULL,
  `remitente_usuario_id` BIGINT UNSIGNED NOT NULL,
  `contenido` TEXT NOT NULL,
  `leido_en` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mensajes_conversacion` (`paciente_id`,`medico_id`,`created_at`),
  KEY `idx_mensajes_remitente` (`remitente_usuario_id`),
  CONSTRAINT `fk_mensajes_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_mensajes_medico` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_mensajes_remitente` FOREIGN KEY (`remitente_usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bitacora_medicamentos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `paciente_id` BIGINT UNSIGNED NOT NULL,
  `receta_detalle_id` BIGINT UNSIGNED NULL,
  `producto_id` BIGINT UNSIGNED NULL,
  `medicamento` VARCHAR(180) NOT NULL,
  `dosis` VARCHAR(120) NULL,
  `programado_para` DATETIME NOT NULL,
  `tomado_en` DATETIME NULL,
  `estado` ENUM('pendiente','tomado','omitido') NOT NULL DEFAULT 'pendiente',
  `notas` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bitacora_paciente_fecha` (`paciente_id`,`programado_para`),
  CONSTRAINT `fk_bitacora_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_bitacora_receta_detalle` FOREIGN KEY (`receta_detalle_id`) REFERENCES `receta_detalles` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_bitacora_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `producto_id` BIGINT UNSIGNED NOT NULL,
  `usuario_id` BIGINT UNSIGNED NULL,
  `tipo` ENUM('entrada','salida','ajuste') NOT NULL,
  `cantidad` INT NOT NULL COMMENT 'Entradas positivas; salidas negativas; ajustes como diferencia.',
  `motivo` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_movimientos_producto_fecha` (`producto_id`,`created_at`),
  KEY `idx_movimientos_usuario_fecha` (`usuario_id`,`created_at`),
  CONSTRAINT `fk_movimientos_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_movimientos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pedidos, ventas y detalle conservan el precio/nombre facturado aunque cambie el catálogo.
CREATE TABLE IF NOT EXISTS `carritos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NULL,
  `token_invitado_hash` CHAR(64) NULL,
  `estado` ENUM('abierto','convertido','abandonado') NOT NULL DEFAULT 'abierto',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_carritos_token_invitado` (`token_invitado_hash`),
  KEY `idx_carritos_usuario_estado` (`usuario_id`,`estado`),
  CONSTRAINT `fk_carritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `carrito_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `carrito_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_carrito_detalles_producto` (`carrito_id`,`producto_id`),
  CONSTRAINT `fk_carrito_detalles_carrito` FOREIGN KEY (`carrito_id`) REFERENCES `carritos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `folio` VARCHAR(40) NOT NULL,
  `tracking_token_hash` CHAR(64) NOT NULL,
  `cliente_usuario_id` BIGINT UNSIGNED NULL,
  `cliente_nombre` VARCHAR(120) NOT NULL,
  `cliente_email` VARCHAR(160) NOT NULL,
  `cliente_telefono` VARCHAR(40) NULL,
  `tipo_entrega` ENUM('envio','recoger') NOT NULL DEFAULT 'envio',
  `destino` VARCHAR(300) NULL,
  `estado` ENUM('recibido','preparando','listo','enviado','en_transito','entregado','verificado','cancelado') NOT NULL DEFAULT 'recibido',
  `paqueteria` VARCHAR(80) NULL,
  `numero_guia` VARCHAR(80) NULL,
  `nota_entrega` VARCHAR(300) NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `envio` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `entregado_en` DATETIME NULL,
  `verificado_en` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pedidos_folio` (`folio`),
  KEY `idx_pedidos_estado_fecha` (`estado`,`created_at`),
  KEY `idx_pedidos_cliente_email` (`cliente_email`),
  CONSTRAINT `fk_pedidos_cliente` FOREIGN KEY (`cliente_usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pedido_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NULL,
  `codigo_barras` VARCHAR(32) NULL,
  `producto_nombre` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `total_linea` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pedido_detalles_pedido` (`pedido_id`),
  CONSTRAINT `fk_pedido_detalles_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_pedido_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `historial_pedido` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` BIGINT UNSIGNED NOT NULL,
  `usuario_id` BIGINT UNSIGNED NULL,
  `estado` ENUM('recibido','preparando','listo','enviado','en_transito','entregado','verificado','cancelado') NOT NULL,
  `nota` VARCHAR(300) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_historial_pedido_fecha` (`pedido_id`,`created_at`),
  CONSTRAINT `fk_historial_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_historial_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ventas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `folio` VARCHAR(40) NOT NULL,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `metodo_pago` VARCHAR(30) NOT NULL DEFAULT 'efectivo',
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ventas_folio` (`folio`),
  KEY `idx_ventas_fecha` (`created_at`),
  KEY `idx_ventas_usuario_fecha` (`usuario_id`,`created_at`),
  CONSTRAINT `fk_ventas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `venta_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `venta_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NULL,
  `codigo_barras` VARCHAR(32) NULL,
  `producto_nombre` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `total_linea` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_venta_detalles_venta` (`venta_id`),
  CONSTRAINT `fk_venta_detalles_venta` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_venta_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de apoyo para clientes, compras y gastos del módulo de tienda.
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NULL,
  `nombre` VARCHAR(160) NOT NULL,
  `email` VARCHAR(160) NULL,
  `telefono` VARCHAR(40) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_clientes_email` (`email`),
  CONSTRAINT `fk_clientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `direcciones_cliente` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `alias` VARCHAR(60) NULL,
  `direccion` VARCHAR(300) NOT NULL,
  `ciudad` VARCHAR(100) NULL,
  `estado` VARCHAR(100) NULL,
  `codigo_postal` VARCHAR(12) NULL,
  `es_principal` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_direcciones_cliente` (`cliente_id`),
  CONSTRAINT `fk_direcciones_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favoritos_usuario_producto` (`usuario_id`,`producto_id`),
  CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_favoritos_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(160) NOT NULL,
  `contacto` VARCHAR(120) NULL,
  `email` VARCHAR(160) NULL,
  `telefono` VARCHAR(40) NULL,
  `direccion` VARCHAR(255) NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_proveedores_nombre` (`nombre`),
  KEY `idx_proveedores_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `compras` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `proveedor_id` BIGINT UNSIGNED NULL,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `folio` VARCHAR(60) NULL,
  `estado` ENUM('pendiente','recibida','cancelada') NOT NULL DEFAULT 'pendiente',
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `fecha_compra` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notas` TEXT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_compras_fecha_estado` (`fecha_compra`,`estado`),
  CONSTRAINT `fk_compras_proveedor` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_compras_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `compra_detalles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `compra_id` BIGINT UNSIGNED NOT NULL,
  `producto_id` BIGINT UNSIGNED NULL,
  `producto_nombre` VARCHAR(160) NOT NULL,
  `cantidad` INT UNSIGNED NOT NULL,
  `costo_unitario` DECIMAL(10,2) NOT NULL,
  `total_linea` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_compra_detalles_compra` (`compra_id`),
  CONSTRAINT `fk_compra_detalles_compra` FOREIGN KEY (`compra_id`) REFERENCES `compras` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_compra_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gastos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` BIGINT UNSIGNED NOT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `importe` DECIMAL(10,2) NOT NULL,
  `fecha_gasto` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gastos_fecha_categoria` (`fecha_gasto`,`categoria`),
  CONSTRAINT `fk_gastos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogo inicial utilizado por el punto de venta y la tienda en línea.
INSERT IGNORE INTO `productos`
  (`sku`,`codigo_barras`,`nombre`,`categoria`,`emoji`,`precio`,`stock`,`stock_minimo`,`activo`)
VALUES
  ('FAR-000001','2000000000015','Paracetamol 500 mg','Medicamentos','💊',45.00,0,5,1),
  ('FAR-000002','2000000000022','Vitamina C 1000 mg','Vitaminas y suplementos','🍊',120.00,0,5,1),
  ('FAR-000003','2000000000039','Termómetro digital','Equipo médico','🌡️',85.00,0,5,1),
  ('FAR-000004','2000000000046','Gasas estériles','Primeros auxilios','▤',60.00,0,5,1),
  ('FAR-000005','2000000000053','Gel antibacterial','Higiene personal','🧴',55.00,0,5,1),
  ('FAR-000006','2000000000060','Protector solar FPS 50','Cuidado de la piel','☀️',189.00,0,5,1),
  ('FAR-000007','2000000000077','Ibuprofeno 400 mg','Medicamentos','💊',75.00,0,5,1),
  ('FAR-000008','2000000000084','Multivitamínico','Vitaminas y suplementos','💙',210.00,0,5,1),
  ('FAR-000009','2000000000091','Tensiómetro digital','Equipo médico','🩺',549.00,0,5,1),
  ('FAR-000010','2000000000107','Oxímetro de pulso','Equipo médico','🫀',329.00,0,5,1),
  ('FAR-000011','2000000000114','Kit de curación','Primeros auxilios','🩹',149.00,0,5,1),
  ('FAR-000012','2000000000121','Crema hidratante','Cuidado de la piel','🧴',135.00,0,5,1);
