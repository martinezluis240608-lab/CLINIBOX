<?php

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\HomeController;
use App\Controllers\MedicoController;
use App\Controllers\PacienteController;
use App\Core\Router;

return function (Router $router): void {
    $router->get('/', [HomeController::class, 'index']);

    $router->get('/login', [AuthController::class, 'login']);
    $router->post('/login', [AuthController::class, 'attempt']);
    $router->post('/logout', [AuthController::class, 'logout']);

    $router->get('/dashboard', [DashboardController::class, 'index']);

    $router->get('/medico/pacientes', [MedicoController::class, 'pacientes']);
    $router->get('/medico/consultas', [MedicoController::class, 'consultas']);
    $router->get('/medico/recetas', [MedicoController::class, 'recetas']);
    $router->get('/medico/expedientes', [MedicoController::class, 'expedientes']);
    $router->get('/medico/agenda', [MedicoController::class, 'agenda']);
    $router->get('/medico/mensajes', [MedicoController::class, 'mensajes']);
    $router->get('/medico/perfil', [MedicoController::class, 'perfil']);

    $router->get('/paciente/consultas', [PacienteController::class, 'consultas']);
    $router->get('/paciente/medicamentos', [PacienteController::class, 'medicamentos']);
    $router->get('/paciente/mensajes', [PacienteController::class, 'mensajes']);
    $router->get('/paciente/recetas', [PacienteController::class, 'recetas']);
    $router->get('/paciente/perfil', [PacienteController::class, 'perfil']);

    $router->get('/admin', [AdminController::class, 'index']);
};
