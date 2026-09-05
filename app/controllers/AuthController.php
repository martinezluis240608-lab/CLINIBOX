<?php

namespace App\Controllers;

use App\Core\Controller;

class AuthController extends Controller
{
    public function login(): void
    {
        if (\auth_user()) {
            $this->redirect('/dashboard');
        }

        $this->view('auth/login', ['title' => 'Iniciar sesion']);
    }

    public function attempt(): void
    {
        $role = $_POST['role'] ?? '';
        $validRoles = ['medico', 'paciente', 'admin'];

        if (!in_array($role, $validRoles, true)) {
            \set_flash('error', 'Selecciona un rol valido para ingresar.');
            $this->redirect('/login');
        }

        $users = [
            'medico' => [
                'name' => 'Dra. Sofia Ramirez',
                'email' => 'medico@clinibox.test',
                'role' => 'medico',
            ],
            'paciente' => [
                'name' => 'Carlos Mendoza',
                'email' => 'paciente@clinibox.test',
                'role' => 'paciente',
            ],
            'admin' => [
                'name' => 'Administrador CliniBox',
                'email' => 'admin@clinibox.test',
                'role' => 'admin',
            ],
        ];

        $_SESSION['user'] = $users[$role];
        $this->redirect('/dashboard');
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();

        header('Location: ' . \url('/'));
        exit;
    }
}
