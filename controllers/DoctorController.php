<?php
class DoctorController extends Controller {
    public function __construct() {
        // Redirigir si no está logueado o si no es doctor
        if(!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'doctor') {
            header('location: /CLINIBOX/public/login');
            exit;
        }
    }

    public function index() {
        $this->view('doctor/dashboard');
    }
}
