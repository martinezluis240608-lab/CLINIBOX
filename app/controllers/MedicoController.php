<?php

namespace App\Controllers;

use App\Core\Controller;

class MedicoController extends Controller
{
    public function pacientes(): void
    {
        $this->requireRole(['medico']);

        $patients = [
            ['name' => 'Carlos Mendoza', 'age' => 42, 'condition' => 'Hipertension', 'last_visit' => '2026-09-01', 'status' => 'En seguimiento'],
            ['name' => 'Lucia Torres', 'age' => 31, 'condition' => 'Migraña cronica', 'last_visit' => '2026-08-27', 'status' => 'Estable'],
            ['name' => 'Miguel Cruz', 'age' => 57, 'condition' => 'Diabetes tipo 2', 'last_visit' => '2026-08-20', 'status' => 'Control mensual'],
        ];

        $this->view('medico/pacientes', ['title' => 'Gestion de pacientes', 'patients' => $patients]);
    }

    public function consultas(): void
    {
        $this->requireRole(['medico']);

        $appointments = [
            ['time' => '09:00', 'patient' => 'Carlos Mendoza', 'type' => 'Seguimiento', 'mode' => 'Presencial'],
            ['time' => '11:30', 'patient' => 'Lucia Torres', 'type' => 'Primera valoracion', 'mode' => 'Virtual'],
            ['time' => '14:00', 'patient' => 'Miguel Cruz', 'type' => 'Revision de estudios', 'mode' => 'Presencial'],
        ];

        $this->view('medico/consultas', ['title' => 'Gestion de consultas', 'appointments' => $appointments]);
    }

    public function recetas(): void
    {
        $this->requireRole(['medico']);

        $prescriptions = [
            ['patient' => 'Carlos Mendoza', 'medicine' => 'Losartan 50 mg', 'dose' => '1 tableta cada 24 h', 'date' => '2026-09-01'],
            ['patient' => 'Lucia Torres', 'medicine' => 'Sumatriptan 50 mg', 'dose' => 'Segun crisis', 'date' => '2026-08-27'],
            ['patient' => 'Miguel Cruz', 'medicine' => 'Metformina 850 mg', 'dose' => '1 tableta cada 12 h', 'date' => '2026-08-20'],
        ];

        $this->view('medico/recetas', ['title' => 'Gestion de recetas', 'prescriptions' => $prescriptions]);
    }

    public function expedientes(): void
    {
        $this->requireRole(['medico']);

        $records = [
            ['patient' => 'Carlos Mendoza', 'summary' => 'Presion arterial con mejor control. Se ajusta seguimiento.', 'updated' => '2026-09-01'],
            ['patient' => 'Lucia Torres', 'summary' => 'Disminucion de episodios de migraña con tratamiento preventivo.', 'updated' => '2026-08-27'],
            ['patient' => 'Miguel Cruz', 'summary' => 'Glucosa en rango aceptable; continuar plan alimenticio.', 'updated' => '2026-08-20'],
        ];

        $this->view('medico/expedientes', ['title' => 'Expedientes clinicos', 'records' => $records]);
    }

    public function agenda(): void
    {
        $this->requireRole(['medico']);

        $schedule = [
            ['day' => 'Lunes', 'hours' => '08:00 - 14:00', 'status' => 'Disponible'],
            ['day' => 'Martes', 'hours' => '10:00 - 18:00', 'status' => 'Disponible'],
            ['day' => 'Miercoles', 'hours' => '08:00 - 12:00', 'status' => 'Alta demanda'],
            ['day' => 'Viernes', 'hours' => '09:00 - 15:00', 'status' => 'Disponible'],
        ];

        $this->view('medico/agenda', ['title' => 'Agenda medica', 'schedule' => $schedule]);
    }

    public function mensajes(): void
    {
        $this->requireRole(['medico']);

        $messages = [
            ['patient' => 'Carlos Mendoza', 'message' => 'Doctora, puedo tomar el medicamento despues de comer?', 'time' => '08:45'],
            ['patient' => 'Lucia Torres', 'message' => 'Hoy tuve dolor leve, desea que adelante mi consulta?', 'time' => '10:12'],
            ['patient' => 'Miguel Cruz', 'message' => 'Ya subi mis resultados para revision.', 'time' => '13:20'],
        ];

        $this->view('medico/mensajes', ['title' => 'Consultas virtuales', 'messages' => $messages]);
    }

    public function perfil(): void
    {
        $this->requireRole(['medico']);

        $profile = [
            'name' => 'Dra. Sofia Ramirez',
            'specialty' => 'Medicina interna',
            'license' => 'CED-CLB-2026',
            'email' => 'medico@clinibox.test',
            'phone' => '+52 55 0000 0000',
        ];

        $this->view('medico/perfil', ['title' => 'Perfil del medico', 'profile' => $profile]);
    }
}
