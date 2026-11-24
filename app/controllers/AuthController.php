<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\User;

class AuthController extends Controller
{
    public function login(): void
    {
        if (\auth_user()) {
            $this->redirect(\auth_role() === 'admin' ? '/admin' : '/dashboard');
        }

        $this->view('auth/login', [
            'title' => 'Iniciar sesión',
            'csrfToken' => $this->csrfToken(),
            'error' => \flash('error'),
            'success' => \flash('success'),
        ]);
    }

    public function attempt(): void
    {
        $this->verifyCsrfToken();

        $loginInput = $_POST['email'] ?? '';
        $identifier = is_string($loginInput) ? trim($loginInput) : '';
        $password = $_POST['password'] ?? '';
        $user = $identifier !== '' && strlen($identifier) <= 160
            ? (new User())->findByLogin($identifier)
            : null;

        if (!$user || $user['estado'] !== 'activo' || !is_string($password) || !password_verify($password, $user['password'])) {
            \set_flash('error', 'El correo o la contraseña no son válidos.');
            $this->redirect('/login');
        }

        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int) $user['id'],
            'name' => $user['nombre'],
            'email' => $user['email'],
            'role' => $user['rol'],
        ];
        $this->redirect($user['rol'] === 'admin' ? '/admin' : ($user['rol'] === 'paciente' ? '/paciente/perfil' : '/dashboard'));
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();

        $this->redirect('/login');
    }
}
