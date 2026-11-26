<?php

namespace App\Controllers;

use App\Core\Controller;

class PacienteController extends Controller
{
    public function inicio(): void
    {
        $this->requireRole(['paciente']);

        $this->view('paciente/inicio', $this->patientViewData());
    }

    public function agendarCita(): void
    {
        $this->view('paciente/agendarCita');
    }

    public function sesionCita(): void
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(['paciente' => \auth_role() === 'paciente']);
    }

    public function recorrido(): void
    {
        $this->view('paciente/recorrido');
    }

    public function consultas(): void
    {
        $this->requireRole(['paciente']);

        $appointments = [
            ['date' => '2026-09-10', 'time' => '09:00', 'doctor' => 'Dra. Sofia Ramirez', 'reason' => 'Seguimiento hipertension', 'status' => 'Confirmada'],
            ['date' => '2026-08-12', 'time' => '10:30', 'doctor' => 'Dra. Sofia Ramirez', 'reason' => 'Revision general', 'status' => 'Finalizada'],
        ];

        $this->view('paciente/consultas', ['title' => 'Mis consultas', 'appointments' => $appointments]);
    }

    public function medicamentos(): void
    {
        $this->requireRole(['paciente']);

        $this->view('paciente/medicamentos');
    }

    public function mensajes(): void
    {
        $this->requireRole(['paciente']);

        $this->view('paciente/mensajes', $this->patientViewData());
    }

    public function recetas(): void
    {
        $this->requireRole(['paciente']);

        $this->view('paciente/recetas');
    }

    public function perfil(): void
    {
        $this->requireRole(['paciente']);

        $this->view('paciente/perfil', $this->patientViewData());
    }

    private function patientViewData(): array
    {
        $user = \auth_user() ?? [];

        return [
            'patientName' => $user['name'] ?? $user['email'] ?? 'Paciente',
            'patientEmail' => $user['email'] ?? '',
        ];
    }
}
