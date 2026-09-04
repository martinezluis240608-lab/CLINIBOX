<?php
class AdminController extends Controller {
    public function __construct() {
        // Redirigir si no está logueado o si no es admin
        if(!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            header('location: /CLINIBOX/public/login');
            exit;
        }
    }

    public function index() {
        $this->view('admin/dashboard');
    }
}
