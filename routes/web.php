<?php

use App\Controllers\AdminController;
use App\Controllers\FarmaciaController;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\HomeController;
use App\Controllers\MedicoController;
use App\Controllers\PacienteController;
use App\Controllers\TiendaController;
use App\Core\Router;

return function (Router $router): void {
    $router->get('/', [HomeController::class, 'index']);

    // Tienda
    $router->get('/tienda', [TiendaController::class, 'index']);
    $router->get('/tienda/index', [TiendaController::class, 'index']);
    $router->get('/tienda/index.html', [TiendaController::class, 'index']);
    $router->get('/tienda/categoria', [TiendaController::class, 'categoria']);
    $router->get('/tienda/categoria.html', [TiendaController::class, 'categoria']);
    $router->get('/categoria.html', [TiendaController::class, 'categoria']);
    $router->get('/favoritos', [TiendaController::class, 'favoritos']);
    $router->get('/favoritos.html', [TiendaController::class, 'favoritos']);
    $router->get('/producto', [TiendaController::class, 'producto']);
    $router->get('/producto.html', [TiendaController::class, 'producto']);
    $router->get('/pedidos', [TiendaController::class, 'pedidos']);
    $router->get('/pedidos.html', [TiendaController::class, 'pedidos']);
    $router->get('/ayuda', [TiendaController::class, 'ayuda']);
    $router->get('/ayuda.html', [TiendaController::class, 'ayuda']);
    $router->get('/carrito', [TiendaController::class, 'carrito']);
    $router->get('/carrito.html', [TiendaController::class, 'carrito']);

    // Autenticación (Unificado para Pacientes y Médicos)
    $router->get('/login', [AuthController::class, 'login']);
    $router->get('/login.html', [AuthController::class, 'login']);
    $router->get('/login_medico', [AuthController::class, 'login']);
    $router->get('/login_medico.html', [AuthController::class, 'login']);
    $router->get('/medico/login_medico.html', [AuthController::class, 'login']);
    $router->get('/auth/login.html', [AuthController::class, 'login']);
    $router->post('/login', [AuthController::class, 'attempt']);
    $router->post('/registro-demo', [AuthController::class, 'registerDemo']);
    $router->post('/logout', [AuthController::class, 'logout']);

    // Presentaciones públicas de médicos
    $router->get('/medicos', [HomeController::class, 'medicos']);
    $router->get('/medicos.html', [HomeController::class, 'medicos']);

    // Punto de venta y API de farmacia
    $router->get('/farmacia', [FarmaciaController::class, 'index']);
    $router->get('/api/farmacia', [FarmaciaController::class, 'api']);
    $router->post('/api/farmacia', [FarmaciaController::class, 'api']);

    // Médico
    $router->get('/medico', [MedicoController::class, 'pacientes']);
    $router->get('/medico/perfil', [MedicoController::class, 'perfil']);
    $router->get('/medico/perfil.html', [MedicoController::class, 'perfil']);
    $router->get('/medico/pacientes', [MedicoController::class, 'pacientes']);
    $router->get('/medico/pacientes.html', [MedicoController::class, 'pacientes']);
    $router->get('/pacientes.html', [MedicoController::class, 'pacientes']);
    $router->get('/medico/consultas', [MedicoController::class, 'consultas']);
    $router->get('/medico/consultas.html', [MedicoController::class, 'consultas']);
    $router->get('/consultas.html', [MedicoController::class, 'consultas']);
    $router->get('/medico/recetas', [MedicoController::class, 'recetas']);
    $router->get('/medico/recetas.html', [MedicoController::class, 'recetas']);
    $router->get('/recetas.html', [MedicoController::class, 'recetas']);
    $router->get('/medico/expedientes', [MedicoController::class, 'expedientes']);
    $router->get('/medico/expedientes.html', [MedicoController::class, 'expedientes']);
    $router->get('/expedientes.html', [MedicoController::class, 'expedientes']);
    $router->get('/medico/agenda', [MedicoController::class, 'agenda']);
    $router->get('/medico/agenda.html', [MedicoController::class, 'agenda']);
    $router->get('/agenda.html', [MedicoController::class, 'agenda']);
    $router->get('/medico/mensajes', [MedicoController::class, 'mensajes']);
    $router->get('/medico/mensajes.html', [MedicoController::class, 'mensajes']);
    $router->get('/mensajes.html', [MedicoController::class, 'mensajes']);

    // Paciente & Citas
    $router->get('/citas', [PacienteController::class, 'agendarCita']);
    $router->get('/citas/sesion', [PacienteController::class, 'sesionCita']);
    $router->get('/citas.html', [PacienteController::class, 'agendarCita']);
    $router->get('/agendarCita.html', [PacienteController::class, 'agendarCita']);
    $router->get('/paciente/agendarCita.html', [PacienteController::class, 'agendarCita']);
    $router->get('/paciente/citas', [PacienteController::class, 'agendarCita']);
    $router->get('/paciente/agendar-cita', [PacienteController::class, 'agendarCita']);
    $router->get('/paciente', [PacienteController::class, 'inicio']);
    $router->get('/paciente/inicio', [PacienteController::class, 'inicio']);
    $router->get('/paciente/inicio.html', [PacienteController::class, 'inicio']);
    $router->get('/inicio.html', [PacienteController::class, 'inicio']);
    $router->get('/paciente/recorrido', [PacienteController::class, 'recorrido']);
    $router->get('/paciente/recorrido.html', [PacienteController::class, 'recorrido']);
    $router->get('/paciente/consultas', [PacienteController::class, 'consultas']);
    $router->get('/paciente/consultas.html', [PacienteController::class, 'consultas']);
    $router->get('/paciente/medicamentos', [PacienteController::class, 'medicamentos']);
    $router->get('/paciente/medicamentos.html', [PacienteController::class, 'medicamentos']);
    $router->get('/medicamentos.html', [PacienteController::class, 'medicamentos']);
    $router->get('/paciente/mensajes', [PacienteController::class, 'mensajes']);
    $router->get('/paciente/mensajes.html', [PacienteController::class, 'mensajes']);
    $router->get('/paciente/recetas', [PacienteController::class, 'recetas']);
    $router->get('/paciente/recetas.html', [PacienteController::class, 'recetas']);
    $router->get('/paciente/perfil', [PacienteController::class, 'perfil']);
    $router->get('/paciente/perfil.html', [PacienteController::class, 'perfil']);
    $router->get('/perfil.html', [PacienteController::class, 'perfil']);

    // Dashboard & Admin
    $router->get('/dashboard', [DashboardController::class, 'index']);
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
