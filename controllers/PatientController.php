<?php
class PatientController extends Controller {
    public function __construct() {
        // Redirigir si no está logueado o si no es paciente
        if(!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'patient') {
            header('location: /CLINIBOX/public/login');
            exit;
        }
    }

    public function index() {
        $this->view('patient/dashboard');
    }
}
