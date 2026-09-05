<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;

final class AuthController extends Controller
{
    public function login(): void
    {
        $this->view('auth/login', ['title' => 'Iniciar sesión']);
    }

    public function authenticate(): void
    {
        // Aquí se validará email, contraseña (password_verify) y el usuario en la BD.
        // Nunca guardes contraseñas sin hash.
        $this->redirect('/login');
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();
        $this->redirect('/login');
    }
}
