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

        $this->view('medico/login_medico', [
            'title' => 'Iniciar sesión',
            'csrfToken' => $this->csrfToken(),
            'error' => \flash('error'),
            'success' => \flash('success'),
        ]);
    }

    public function attempt(): void
    {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        if (!is_string($email) || !is_string($password)) {
            $this->fail('Correo o contraseña incorrectos.');
        }
        $email = strtolower(trim($email));

        if ($email === '' || $password === '') {
            $this->fail('Escribe tu correo y contraseña.');
        }

        if (\config('demo_auth') && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $accounts = [
                'paciente' => ['id' => 1, 'name' => 'Carlos Mendoza'],
                'medico' => ['id' => 2, 'name' => 'Dra. Sofia Ramirez'],
            ];
            [$role, $domain] = explode('@', $email, 2);
            if (isset($accounts[$role]) && in_array($domain, ['demo.com', 'clinibox.test'], true)
                && hash_equals('123456', $password)) {
                $this->startSession($accounts[$role] + ['email' => $email, 'role' => $role]);
            }
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

        $this->startSession([
            'id' => $user['id'] ?? null,
            'name' => $user['nombre'] ?? $user['name'] ?? $email,
            'email' => $email,
            'role' => $role,
        ]);
    }

    public function registerDemo(): void
    {
        if (!\config('demo_auth')) {
            $this->redirect('/login?error=registro');
        }
        if (\auth_user()) {
            $this->redirect($this->destinationFor((string) \auth_role()));
        }

        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        if (!is_string($name) || trim($name) === '' || strlen($name) > 120
            || !is_string($email) || strlen($email) > 160 || !filter_var(trim($email), FILTER_VALIDATE_EMAIL)) {
            $this->redirect('/login?registro=1&error=registro');
        }

        $this->startSession(['id' => null, 'name' => trim($name), 'email' => trim($email), 'role' => 'paciente']);
    }

    private function startSession(array $user): void
    {
        session_regenerate_id(true);
        $_SESSION['user'] = $user;
        $this->redirect($this->destinationFor($user['role']));
    }

    public function logout(): void
    {
        $_SESSION = [];
        $cookie = session_get_cookie_params();
        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path' => $cookie['path'],
            'domain' => $cookie['domain'],
            'secure' => $cookie['secure'],
            'httponly' => $cookie['httponly'],
            'samesite' => $cookie['samesite'],
        ]);
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
            'paciente' => '/paciente/inicio',
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
