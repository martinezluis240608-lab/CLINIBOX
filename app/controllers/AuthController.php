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

    public function registerPatient(): void
    {
        if (\auth_user()) {
            $this->redirect($this->destinationFor((string) \auth_role()));
        }

        try {
            $this->verifyCsrfToken();
        } catch (\RuntimeException $exception) {
            \set_flash('error', 'El formulario venció. Intenta registrarte otra vez.');
            $this->redirect('/login?registro=1');
        }

        $name = $_POST['nombre'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $accountType = $_POST['tipo_cuenta'] ?? 'paciente';
        $license = $_POST['cedula_profesional'] ?? '';
        $specialty = $_POST['especialidad'] ?? '';
        $phone = $_POST['telefono'] ?? '';
        $name = is_string($name) ? trim(strip_tags($name)) : '';
        $email = is_string($email) ? strtolower(trim($email)) : '';
        $accountType = is_string($accountType) ? strtolower(trim($accountType)) : '';
        $license = is_string($license) ? trim(strip_tags($license)) : '';
        $specialty = is_string($specialty) ? trim(strip_tags($specialty)) : '';
        $phone = is_string($phone) ? trim(strip_tags($phone)) : '';

        if (
            $name === '' || mb_strlen($name, 'UTF-8') > 120 ||
            !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 160 ||
            !is_string($password) || strlen($password) < 6 || strlen($password) > 200 ||
            !in_array($accountType, ['paciente', 'medico'], true) ||
            ($accountType === 'medico' && (
                $license === '' || mb_strlen($license, 'UTF-8') > 40 ||
                $specialty === '' || mb_strlen($specialty, 'UTF-8') > 120 ||
                mb_strlen($phone, 'UTF-8') > 30
            ))
        ) {
            \set_flash('error', 'Revisa tus datos. La contraseña debe tener al menos 6 caracteres y los médicos deben indicar cédula y especialidad.');
            $this->redirect('/login?registro=1');
        }

        try {
            $users = new User();
            $userId = $accountType === 'medico'
                ? $users->createDoctorAccount($name, $email, $password, $license, $specialty, $phone)
                : $users->createPatientAccount($name, $email, $password);
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                $message = $accountType === 'medico'
                    ? 'El correo o la cédula profesional ya están registrados.'
                    : 'Ya existe una cuenta registrada con ese correo.';
                \set_flash('error', $message);
                $this->redirect('/login?registro=1');
            }

            error_log('CliniBox patient registration DB: ' . $exception->getMessage());
            \set_flash('error', 'No se pudo guardar la cuenta. Revisa que MySQL esté iniciado y vuelve a intentarlo.');
            $this->redirect('/login?registro=1');
        }

        $this->startSession([
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => $accountType,
        ]);
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
