<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;

final class PatientController extends Controller
{
    public function dashboard(): void { Auth::requireRole('patient', 'admin'); $this->view('patient/dashboard', ['title' => 'Mi salud']); }
    public function appointments(): void { Auth::requireRole('patient', 'admin'); $this->view('patient/module', ['title' => 'Mis consultas']); }
    public function medications(): void { Auth::requireRole('patient', 'admin'); $this->view('patient/module', ['title' => 'Bitácora de medicamentos']); }
    public function prescriptions(): void { Auth::requireRole('patient', 'admin'); $this->view('patient/module', ['title' => 'Historial de recetas']); }
    public function messages(): void { Auth::requireRole('patient', 'admin'); $this->view('patient/module', ['title' => 'Consulta rápida']); }
}
