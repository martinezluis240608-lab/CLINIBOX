<?php

namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller
{
    public function index(): void
    {
        $roles = [
            [
                'name' => 'Medico',
                'description' => 'Pacientes, consultas, recetas, expedientes clinicos, agenda, mensajes y perfil profesional.',
            ],
            [
                'name' => 'Paciente',
                'description' => 'Consultas, bitacora de medicamentos, mensajes con su medico, recetas y perfil.',
            ],
            [
                'name' => 'Administrador',
                'description' => 'Acceso completo para gestionar usuarios, catalogos y operacion general de la clinica.',
            ],
        ];

        $this->view('home/index', [
            'title' => 'Inicio',
            'roles' => $roles,
        ]);
    }
}
