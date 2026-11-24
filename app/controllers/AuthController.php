<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\User;
use PDOException;

class AuthController extends Controller
{
    public function login(): void
    {
        if (\auth_user()) {
            $this->redirect($this->destinationFor((string) \auth_role()));
        }

        $this->view('medico/login_medico', ['title' => 'Iniciar sesion']);
    }

    public function attempt(): void
    {
        $email = strtolower(trim((string) ($_POST['email'] ?? '')));
        $password = (string) ($_POST['password'] ?? '');

        if ($email === '' || $password === '') {
            $this->fail('Escribe tu correo y contraseña.');
        }

        try {
            $user = (new User())->findByEmail($email);
        } catch (PDOException $exception) {
            error_log('CliniBox login DB: ' . $exception->getMessage());
            $this->fail('No se pudo conectar con la base de datos. Intenta de nuevo más tarde.');
        }

        if (!$user || !$this->passwordMatches($password, (string) ($user['password'] ?? ''))) {
            $this->fail('Correo o contraseña incorrectos.');
        }

        if (isset($user['estado']) && strtolower((string) $user['estado']) !== 'activo') {
            $this->fail('Esta cuenta está inactiva. Contacta al administrador.');
        }

        $role = $this->normaliseRole((string) ($user['rol'] ?? $user['role'] ?? ''));
        if ($role === null) {
            $this->fail('La cuenta no tiene un rol válido. Contacta al administrador.');
        }

        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => $user['id'] ?? null,
            'name' => $user['nombre'] ?? $user['name'] ?? $email,
            'email' => $email,
            'role' => $role,
        ];

        $this->redirect($this->destinationFor($role));
    }

    public function logout(): void
    {
        $_SESSION = [];
        session_destroy();
        $this->redirect('/login');
    }

    private function passwordMatches(string $password, string $storedPassword): bool
    {
        if (password_verify($password, $storedPassword)) {
            return true;
        }

        // Acepta temporalmente claves antiguas guardadas en texto para facilitar migraciones.
        return $storedPassword !== '' && hash_equals($storedPassword, $password);
    }

    private function normaliseRole(string $role): ?string
    {
        $role = strtolower(trim($role));
        $aliases = ['doctor' => 'medico', 'patient' => 'paciente', 'administrador' => 'admin'];
        $role = $aliases[$role] ?? $role;
        return in_array($role, ['paciente', 'medico', 'farmacia', 'admin'], true) ? $role : null;
    }

    private function destinationFor(string $role): string
    {
        return match ($role) {
            'paciente' => '/paciente/perfil',
            'medico' => '/medico/pacientes',
            'farmacia' => '/farmacia',
            'admin' => '/admin',
            default => '/login',
        };
    }

    private function fail(string $message): void
    {
        \set_flash('error', $message);
        $this->redirect('/login?error=1');
    }
}

