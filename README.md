# CliniBox

Aplicación clínica en PHP con arquitectura MVC, preparada para ejecutarse con XAMPP, PHP 8 y MySQL 8 o MariaDB 10.4 o posterior.

## Instalación local

1. Copia el proyecto en `C:\xampp\htdocs\CLINIBOX` e inicia Apache y MySQL en XAMPP.
2. Abre phpMyAdmin en `http://localhost/phpmyadmin` y usa **Importar** para cargar `database/schema.sql`. El archivo crea la base `clinibox`, sus tablas, llaves foráneas e índices. No agrega usuarios, pacientes ni productos ficticios, y no borra tablas ni datos existentes.
3. Si existe una base anterior llamada `clinibox_db`, importa también `database/migrations/20261126_import_legacy_clinibox_db.sql` para conservar sus cuentas, perfiles y citas.
4. En bases que ya existían, importa `database/migrations/20261126_add_patient_emergency_relationship.sql` y `database/migrations/20261126_add_recipe_diagnosis.sql` para agregar los campos nuevos del perfil y las recetas.
5. Si tu MySQL usa credenciales distintas a las de XAMPP (`root` sin contraseña), configura los valores `CLINIBOX_DB_HOST`, `CLINIBOX_DB_PORT`, `CLINIBOX_DB_NAME`, `CLINIBOX_DB_USER` y `CLINIBOX_DB_PASSWORD` en el entorno de PHP/Apache. También puedes ajustar los valores predeterminados en `app/config/app.php`.
6. Abre `http://localhost/CLINIBOX/public/`. Apache debe tener habilitado `mod_rewrite` para rutas como `/login` y `/dashboard`; `public/.htaccess` contiene las reglas.
7. En una instalación nueva, crea la primera cuenta de administrador desde `/admin/configurar` y luego inicia sesión. Desde **Registrar**, cualquier persona puede crear una cuenta de paciente o médico sin aprobación de administrador.

La aplicación abre una conexión PDO con MySQL de forma diferida al primer acceso a un modelo. La configuración central está en `app/config/app.php` y `app/config/Database.php`; usa consultas preparadas, `utf8mb4`, excepciones PDO y transacciones para las operaciones de inventario.

## Esquema incluido

`database/schema.sql` contiene las tablas relacionales para:

- Cuentas, perfiles de médicos y pacientes, agenda y consultas.
- Expedientes clínicos, recetas y sus medicamentos, mensajes y bitácora de tomas.
- Catálogo de productos, inventario y movimientos auditables.
- Carritos, pedidos, detalle e historial de entrega, ventas y detalle de venta.
- Clientes y direcciones, favoritos, proveedores, compras y gastos de tienda.

Las relaciones usan claves foráneas con reglas de borrado explícitas. Los registros clínicos, ventas y movimientos conservan referencias para no perder historial; por eso las cuentas y productos con actividad deben desactivarse, no borrarse físicamente.

## Módulos y persistencia actual

- El inicio de sesión, las cuentas, el perfil clínico, citas, consultas, expedientes, recetas y mensajes se consultan y guardan en MySQL.
- El punto de venta, catálogo e inventario de farmacia, ventas, pedidos y seguimiento en línea también usan MySQL. Los pedidos públicos guardan un hash del token de seguimiento.
- La tienda pública solo muestra productos activos con existencias. El catálogo inicia vacío y se llena desde Inventario; no se vuelven a cargar productos de ejemplo.
- El carrito y la lista de favoritos siguen siendo selecciones temporales del navegador. Los formularios de cuenta y atención clínica guardan sus datos en la base de datos.

## Cuentas

El acceso valida las credenciales contra `usuarios`; no existen cuentas de demostración. El formulario **Registrar** crea una cuenta persistente en `usuarios` y su perfil en `pacientes` o `medicos` dentro de una transacción. Las contraseñas se guardan con `password_hash` de PHP. El registro médico solicita cédula profesional y especialidad, pero no verifica esos datos con una autoridad externa.

## Estructura

```text
app/
  config/       Configuración y conexión PDO
  controllers/  Controladores MVC
  core/         Router, helpers y autoload
  models/       Modelos de acceso a datos
  views/        Vistas por módulo y rol
  storage/      Archivos locales auxiliares y datos heredados
database/
  schema.sql    Esquema MySQL/MariaDB inicial
public/
  assets/       CSS y JavaScript
  index.php     Entrada del MVC
routes/
  web.php       Rutas de la aplicación
```
