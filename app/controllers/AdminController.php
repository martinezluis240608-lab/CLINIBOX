<?php

namespace App\Controllers;

use App\Core\Controller;

class AdminController extends Controller
{
    public function index(): void
    {
        $this->requireRole(['admin']);

        $stats = [
            ['label' => 'Pacientes activos', 'value' => '128'],
            ['label' => 'Medicos registrados', 'value' => '18'],
            ['label' => 'Consultas este mes', 'value' => '342'],
            ['label' => 'Recetas emitidas', 'value' => '276'],
        ];

        $users = [
            ['name' => 'Dra. Sofia Ramirez', 'role' => 'Medico', 'status' => 'Activo'],
            ['name' => 'Carlos Mendoza', 'role' => 'Paciente', 'status' => 'Activo'],
            ['name' => 'Mesa de administracion', 'role' => 'Administrador', 'status' => 'Activo'],
        ];

        $this->view('admin/index', [
            'title' => 'Administracion',
            'stats' => $stats,
            'users' => $users,
        ]);
    }
}
