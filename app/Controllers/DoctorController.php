<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;

final class DoctorController extends Controller
{
    public function dashboard(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/dashboard', ['title' => 'Panel médico']); }
    public function patients(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/module', ['title' => 'Mis pacientes']); }
    public function appointments(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/module', ['title' => 'Agenda médica']); }
    public function records(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/module', ['title' => 'Expedientes clínicos']); }
    public function prescriptions(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/module', ['title' => 'Recetas médicas']); }
    public function messages(): void { Auth::requireRole('doctor', 'admin'); $this->view('doctor/module', ['title' => 'Consultas virtuales']); }
}
