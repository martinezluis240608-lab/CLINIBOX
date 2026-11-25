<?php

namespace App\Controllers;

use App\Core\Controller;

class DashboardController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $role = \auth_role();

        if ($role === 'paciente') {
            $this->redirect('/paciente/inicio');
        }

        if ($role === 'farmacia') {
            $this->redirect('/farmacia');
        }

        $this->view('dashboard/index', [
            'title' => 'Panel principal',
            'modules' => $this->modulesFor($role),
        ]);
    }

    private function modulesFor(?string $role): array
    {
        if ($role === 'medico') {
            return [
                ['title' => 'Pacientes', 'description' => 'Registro y seguimiento de pacientes asignados.', 'url' => '/medico/pacientes'],
                ['title' => 'Consultas', 'description' => 'Control de consultas medicas presenciales y virtuales.', 'url' => '/medico/consultas'],
                ['title' => 'Recetas', 'description' => 'Emision e historial de recetas medicas.', 'url' => '/medico/recetas'],
                ['title' => 'Expedientes', 'description' => 'Historia clinica organizada por paciente.', 'url' => '/medico/expedientes'],
                ['title' => 'Agenda', 'description' => 'Horarios, citas y disponibilidad del medico.', 'url' => '/medico/agenda'],
                ['title' => 'Mensajes', 'description' => 'Consultas rapidas con pacientes por mensaje.', 'url' => '/medico/mensajes'],
            ];
        }

        return [
            ['title' => 'Administracion', 'description' => 'Usuarios, roles y configuracion general.', 'url' => '/admin'],
            ['title' => 'Modulo medico', 'description' => 'Acceso a gestion clinica del medico.', 'url' => '/medico/pacientes'],
            ['title' => 'Modulo paciente', 'description' => 'Acceso a experiencia del paciente.', 'url' => '/paciente/consultas'],
        ];
    }
}
