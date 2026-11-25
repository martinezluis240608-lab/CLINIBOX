<?php

namespace App\Controllers;

use App\Core\Controller;

class MedicoController extends Controller
{
    public function pacientes(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/pacientes');
    }

    public function consultas(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/consultas');
    }

    public function recetas(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/recetas');
    }

    public function expedientes(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/expedientes');
    }

    public function agenda(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/agenda');
    }

    public function mensajes(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/mensajes');
    }

    public function perfil(): void
    {
        $this->requireRole(['medico']);

        $this->view('medico/perfil');
    }
}
