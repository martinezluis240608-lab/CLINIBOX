<?php

namespace App\Controllers;

use App\Core\Controller;

class PacienteController extends Controller
{
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

        $logs = [
            ['medicine' => 'Losartan 50 mg', 'schedule' => '08:00', 'taken' => 'Si', 'notes' => 'Tomado con desayuno'],
            ['medicine' => 'Vitamina D', 'schedule' => '14:00', 'taken' => 'Pendiente', 'notes' => 'Recordatorio activo'],
            ['medicine' => 'Atorvastatina 20 mg', 'schedule' => '21:00', 'taken' => 'Pendiente', 'notes' => 'Tomar antes de dormir'],
        ];

        $this->view('paciente/medicamentos', ['title' => 'Bitacora de medicamentos', 'logs' => $logs]);
    }

    public function mensajes(): void
    {
        $this->requireRole(['paciente']);

        $thread = [
            ['from' => 'Paciente', 'message' => 'Doctora, puedo tomar el medicamento despues de comer?', 'time' => '08:45'],
            ['from' => 'Medico', 'message' => 'Si, puedes tomarlo despues del desayuno. Evita suspenderlo.', 'time' => '08:58'],
            ['from' => 'Paciente', 'message' => 'Gracias, lo registro en mi bitacora.', 'time' => '09:02'],
        ];

        $this->view('paciente/mensajes', ['title' => 'Consulta rapida', 'thread' => $thread]);
    }

    public function recetas(): void
    {
        $this->requireRole(['paciente']);

        $prescriptions = [
            ['date' => '2026-09-01', 'doctor' => 'Dra. Sofia Ramirez', 'medicine' => 'Losartan 50 mg', 'indications' => '1 tableta cada 24 h por 30 dias'],
            ['date' => '2026-08-12', 'doctor' => 'Dra. Sofia Ramirez', 'medicine' => 'Atorvastatina 20 mg', 'indications' => '1 tableta por la noche'],
        ];

        $this->view('paciente/recetas', ['title' => 'Historial de recetas', 'prescriptions' => $prescriptions]);
    }

    public function perfil(): void
    {
        $this->requireRole(['paciente']);

        $profile = [
            'name' => 'Carlos Mendoza',
            'email' => 'paciente@clinibox.test',
            'phone' => '+52 55 1111 1111',
            'birthdate' => '1984-03-12',
            'blood_type' => 'O+',
            'doctor' => 'Dra. Sofia Ramirez',
        ];

        $this->view('paciente/perfil', ['title' => 'Mi perfil', 'profile' => $profile]);
    }
}
