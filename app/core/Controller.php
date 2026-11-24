<?php

namespace App\Core;

abstract class Controller
{
    // Renderiza la vista solicitada; las vistas viven separadas de la logica PHP.
    protected function view(string $view, array $data = [], ?string $layout = null): void
    {
        $viewBase = APP_PATH . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $view);
        $phpViewPath = $viewBase . '.php';
        $viewPath = file_exists($phpViewPath) ? $phpViewPath : $viewBase . '.html';

        if (!file_exists($viewPath)) {
            throw new \RuntimeException("La vista {$view} no existe.");
        }

        if (substr($viewPath, -4) === '.php') {
            extract($data, EXTR_SKIP);
            require $viewPath;
            return;
        }

        readfile($viewPath);
    }

    protected function redirect(string $path): void
    {
        // Construye una URL local y termina la peticion despues de redirigir.
        header('Location: ' . \url($path));
        exit;
    }

    protected function requireAuth(): void
    {
        // Impide continuar cuando no hay una sesion autenticada.
        if (!\auth_user()) {
            $this->redirect('/login');
        }
    }

    protected function requireRole(array $roles): void
    {
        // Verifica autenticacion y autorizacion antes de mostrar una pantalla protegida.
        $this->requireAuth();

        $role = \auth_role();

        if ($role === 'admin' || in_array($role, $roles, true)) {
            return;
        }

        http_response_code(403);
        $this->view('errors/403', ['title' => 'Acceso restringido']);
        exit;
    }

    protected function csrfToken(): string
    {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        return $_SESSION['csrf_token'];
    }

    protected function verifyCsrfToken(): void
    {
        $token = $_POST['csrf_token'] ?? '';

        if (!is_string($token) || !hash_equals($this->csrfToken(), $token)) {
            http_response_code(419);
            throw new \RuntimeException('La solicitud expiró. Recarga la página e inténtalo de nuevo.');
        }
    }
}
