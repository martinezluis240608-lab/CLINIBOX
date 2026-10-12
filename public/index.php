<?php

declare(strict_types=1);

// Define las rutas base para que el resto de la aplicacion encuentre sus archivos.
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . DIRECTORY_SEPARATOR . 'app');

// Carga el autoload de clases y las funciones compartidas antes de atender la peticion.
require APP_PATH . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'Autoloader.php';
require APP_PATH . DIRECTORY_SEPARATOR . 'core' . DIRECTORY_SEPARATOR . 'helpers.php';

// Mantiene los datos de sesion disponibles para autenticacion y permisos.
session_start();

// Carga la configuracion global, incluida la conexion con la base de datos.
$GLOBALS['config'] = require APP_PATH . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'app.php';

use App\Core\Router;

// Registra las rutas de la aplicacion y envia la peticion al controlador correspondiente.
$router = new Router();
$routes = require ROOT_PATH . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'web.php';
$routes($router);

$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');
