<?php

namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller
{
    public function index(): void
    {
        // Redirigir al único sitio oficial de arranque del sistema
        header('Location: /CLINIBOX/');
        exit;
    }

    public function medicos(): void
    {
        $this->view('presentaciones/medicos');
    }
}
