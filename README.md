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

La pantalla de login todavia usa datos de demostracion para navegar por roles. El siguiente paso natural es conectar `AuthController` con la tabla `usuarios` y crear los CRUD reales de cada modulo.
