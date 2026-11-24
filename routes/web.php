<?php

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\HomeController;
use App\Controllers\MedicoController;
use App\Controllers\PacienteController;
use App\Controllers\TiendaController;
use App\Core\Router;

return function (Router $router): void {
    // Pagina publica y catalogo de la tienda.
    $router->get('/', [HomeController::class, 'index']);
    $router->get('/tienda', [TiendaController::class, 'index']);
    $router->get('/tienda/categoria', [TiendaController::class, 'categoria']);
    $router->get('/categoria.html', [TiendaController::class, 'categoria']);
    $router->get('/favoritos', [TiendaController::class, 'favoritos']);
    $router->get('/favoritos.html', [TiendaController::class, 'favoritos']);
    $router->get('/producto', [TiendaController::class, 'producto']);
    $router->get('/producto.html', [TiendaController::class, 'producto']);
    $router->get('/pedidos', [TiendaController::class, 'pedidos']);
    $router->get('/ayuda', [TiendaController::class, 'ayuda']);
    $router->get('/carrito', [TiendaController::class, 'carrito']);

    // Autenticacion: GET muestra el formulario; POST procesa credenciales o cierre de sesion.
    $router->get('/login', [AuthController::class, 'login']);
    $router->post('/login', [AuthController::class, 'attempt']);
    $router->post('/logout', [AuthController::class, 'logout']);

    // Panel principal y recorrido publico del paciente.
    $router->get('/dashboard', [DashboardController::class, 'index']);

    $router->get('/paciente/recorrido', [PacienteController::class, 'recorrido']);

    // Pantallas del area medica, atendidas por MedicoController.
    $router->get('/medico/pacientes', [MedicoController::class, 'pacientes']);
    $router->get('/medico/consultas', [MedicoController::class, 'consultas']);
    $router->get('/medico/recetas', [MedicoController::class, 'recetas']);
    $router->get('/medico/expedientes', [MedicoController::class, 'expedientes']);
    $router->get('/medico/agenda', [MedicoController::class, 'agenda']);
    $router->get('/medico/mensajes', [MedicoController::class, 'mensajes']);
    $router->get('/medico/perfil', [MedicoController::class, 'perfil']);

    // Pantallas del area del paciente, atendidas por PacienteController.
    $router->get('/paciente/consultas', [PacienteController::class, 'consultas']);
    $router->get('/paciente/medicamentos', [PacienteController::class, 'medicamentos']);
    $router->get('/paciente/mensajes', [PacienteController::class, 'mensajes']);
    $router->get('/paciente/recetas', [PacienteController::class, 'recetas']);
    $router->get('/paciente/perfil', [PacienteController::class, 'perfil']);

    // Panel de administracion.
    $router->get('/admin', [AdminController::class, 'index']);
    $router->get('/admin/api/resumen', [AdminController::class, 'summary']);
    $router->get('/admin/api/productos', [AdminController::class, 'productsData']);
    $router->get('/admin/api/inventario', [AdminController::class, 'inventoryData']);
    $router->get('/admin/api/administradores', [AdminController::class, 'administratorsData']);
    $router->get('/admin/api/configurar', [AdminController::class, 'setupData']);
    $router->get('/admin/productos', [AdminController::class, 'products']);
    $router->post('/admin/productos/guardar', [AdminController::class, 'saveProduct']);
    $router->get('/admin/inventario', [AdminController::class, 'inventory']);
    $router->post('/admin/inventario/ajustar', [AdminController::class, 'adjustStock']);
    $router->get('/admin/administradores', [AdminController::class, 'administrators']);
    $router->post('/admin/administradores', [AdminController::class, 'createAdministrator']);
    $router->get('/admin/configurar', [AdminController::class, 'setup']);
    $router->post('/admin/configurar', [AdminController::class, 'createFirstAdministrator']);
};
