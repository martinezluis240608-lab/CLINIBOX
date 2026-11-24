# CliniBox

Aplicacion clinica en PHP con arquitectura MVC para XAMPP.

## Como abrirlo

1. Inicia Apache y MySQL desde el panel de XAMPP.
2. Importa `database/schema.sql` desde phpMyAdmin.
3. Revisa las credenciales en `app/config/app.php`.
4. Abre `http://localhost/CLINIBOX/CLINIBOX/`.

Tambien puedes entrar directo a:

```text
http://localhost/CLINIBOX/CLINIBOX/public/
```

El proyecto redirige a `public/`, que es el punto de entrada del MVC. Apache necesita tener habilitado `mod_rewrite` para que funcionen rutas como `/login` o `/dashboard`; `public/.htaccess` ya contiene la regla necesaria.

## Estructura

```text
app/
  config/         Configuracion general y conexion PDO
  controllers/    Controladores por modulo y rol
  core/           Router, controlador base, autoload y helpers
  models/         Modelos para tablas principales
  views/          Vistas HTML separadas por modulo
database/
  schema.sql      Tablas iniciales para MySQL
public/
  assets/         CSS y JavaScript publico
  index.php       Front controller
routes/
  web.php         Rutas de la aplicacion
```

## Roles y modulos

- Medico: pacientes, consultas, recetas, expedientes clinicos, agenda, consultas virtuales y perfil.
- Paciente: consultas, bitacora de medicamentos, mensajes con su medico, recetas y perfil.
- Administrador: acceso general a usuarios, roles y modulos del sistema.

## Base de datos

El archivo `database/schema.sql` crea la base `clinibox` y las tablas iniciales:

- `usuarios`
- `medicos`
- `pacientes`
- `consultas`
- `recetas`
- `expedientes_clinicos`
- `agenda_medica`
- `mensajes`
- `bitacora_medicamentos`

Para activar el modo de demostración en una instalación local, configura la variable de entorno `CLINIBOX_DEMO_AUTH=1` en PHP. Permite iniciar sesión sin MySQL con `paciente@demo.com` o `medico@demo.com` y la contraseña `123456`. También admite los correos equivalentes terminados en `@clinibox.test`. El registro temporal de paciente solo dura hasta el cierre de sesión. Para usar cuentas de MySQL, crea cuentas activas con contraseñas almacenadas como hash generado por `password_hash` de PHP.

Las vistas del paciente todavía contienen datos de demostración. Las reservas, los cambios de perfil y el registro de tomas se guardan en el navegador. La mensajería y el pago en línea requieren integración con el servidor.
