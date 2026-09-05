# CliniBox

Aplicación clínica en PHP con arquitectura MVC para XAMPP.

## Estructura

- `public/`: único directorio expuesto por Apache; contiene `index.php` y recursos estáticos.
- `app/Controllers/`: recibe cada ruta y coordina la petición.
- `app/Models/`: acceso a datos y reglas de cada entidad.
- `app/Views/`: HTML/PHP, separado de la lógica.
- `app/Core/`: router, controlador base, autenticación y conexión PDO.
- `database/schema.sql`: esquema inicial MySQL.

## Inicio con XAMPP

1. Inicia Apache y MySQL desde el panel de XAMPP.
2. Importa `database/schema.sql` con phpMyAdmin.
3. Revisa las credenciales de `app/Config/database.php`.
4. Abre `http://localhost/CLINIBOX/public/`.

Apache necesita tener habilitado `mod_rewrite` para que las rutas funcionen. El archivo `public/.htaccess` ya contiene la regla necesaria.

## Roles y módulos

| Rol | Módulos iniciales |
| --- | --- |
| Médico | Pacientes, agenda, consultas, recetas, expedientes, mensajería y perfil. |
| Paciente | Consultas, bitácora de medicamentos, recetas, mensajería y perfil. |
| Administrador | Acceso transversal para administrar la operación. |

Los controladores ya protegen las rutas por rol. El siguiente paso es completar el inicio de sesión contra la tabla `users` y crear las operaciones CRUD de cada módulo.
