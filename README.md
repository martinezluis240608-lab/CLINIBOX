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
  views/          Vistas separadas por modulo, incluida administador_tienda/
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
- Administrador de tienda: catalogo, ventas, clientes, inventario, compras y gastos, reportes y comprobantes locales; los datos de estos modulos se guardan en IndexedDB del navegador.

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
- `productos`
- `movimientos_inventario`

El acceso se valida con `usuarios` y contrasenas almacenadas con `password_hash`. Despues de importar el esquema, abre `/admin/configurar` para crear la primera cuenta administradora; este formulario deja de crear cuentas cuando ya existe un administrador activo. Las cuentas adicionales se dan de alta desde el panel.

## Tienda

- `public/admin/tienda.html` es el panel de tienda estático en HTML. El acceso desde las pantallas de resumen, productos e inventario lleva a este panel; el módulo conserva el estilo y la navegación adaptable de CliniBox.
- `public/assets/css/administador_tienda.css` mantiene los estilos existentes; `public/assets/css/store-admin-local.css` añade los componentes responsive de esta interfaz.
- `public/assets/js/store-admin-local.js` implementa productos, ventas, clientes, inventario, compras y gastos, reportes, comprobantes, empleados, administradores, novedades, soporte, preferencias y el enlace de WhatsApp. Las secciones del panel se abren dentro de la misma página. El directorio de administradores permite registrar y activar/desactivar personas en IndexedDB, pero no crea credenciales ni concede acceso al sistema. El catálogo ofrece las siete categorías de tienda, calcula el precio de venta sobre el costo y registra las entradas nuevas sumándolas al stock actual. La persistencia se realiza en el navegador actual; no usa endpoints de tienda ni sincroniza los datos con MySQL u otros dispositivos.
- Los 12 productos del catálogo estático se precargan con sus precios actuales y existencias iniciales sugeridas, marcadas para confirmar con un conteo físico. Las ventas se habilitan para cada producto después de confirmar su existencia en Inventario. No se inventan ventas, clientes ni movimientos: el historial y los reportes comienzan vacíos.
- Facturación crea comprobantes internos imprimibles; no son CFDI ni sustituyen el timbrado fiscal. «Empleados IA» administra el directorio del equipo sin integrar servicios de IA. WhatsApp abre un enlace `wa.me` sin enviar mensajes automáticamente. Las solicitudes de soporte y las novedades se guardan localmente y no se envían a terceros.
- Para abrir directamente el panel local, usa `http://localhost/CLINIBOX/CLINIBOX/public/admin/tienda.html`. Esta implementación se limita a HTML, CSS y JavaScript; no cambia controladores, rutas ni tablas PHP/MySQL.
- `app/views/tienda/` contiene las vistas de la tienda, categorias, productos, carrito y favoritos.
- `public/assets/css/tienda.css` controla el diseño y los puntos de quiebre. En tablet y movil, el panel de recetas permanece visible para que sus acciones no se pierdan; el resumen lateral de la canasta se oculta en esos tamaños.
- `public/assets/js/carrito.js` expone `window.cliniboxCart` como API compartida y guarda los productos en `localStorage` bajo `cliniboxCart`. Cada guardado emite `clinibox:cart-updated` para que la vista de tienda refresque su canasta.
- `public/assets/js/tienda.js` renderiza productos, escucha `clinibox:cart-updated` y sincroniza productos, cantidades, totales y contadores de la canasta lateral.
- El control de tamaño parte de escala `0.85`, correspondiente al diseño estándar compacto. Las vistas conservan la selección posterior en `localStorage` bajo `cliniboxStoreZoomV3`; “Restablecer” vuelve a `0.85`. Al superar escala `1`, la navegación de escritorio se compacta a iconos accesibles para dar más espacio a los productos.
- Al modificar reglas responsive, conservar visibles los controles funcionales de recetas y probar los botones de compra en escritorio y en una ventana estrecha.
