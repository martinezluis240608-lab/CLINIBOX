<?php

namespace App\Core;

abstract class Controller
{
    protected function view(string $view, array $data = [], ?string $layout = 'layouts/app'): void
    {
        $viewPath = APP_PATH . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $view) . '.php';

        if (!file_exists($viewPath)) {
            throw new \RuntimeException("La vista {$view} no existe.");
        }

        extract($data, EXTR_SKIP);

        ob_start();
        require $viewPath;
        $content = ob_get_clean();

        if ($layout === null) {
            echo $content;
            return;
        }

        $layoutPath = APP_PATH . DIRECTORY_SEPARATOR . 'views' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $layout) . '.php';

        if (!file_exists($layoutPath)) {
            throw new \RuntimeException("El layout {$layout} no existe.");
        }

        require $layoutPath;
    }

    protected function redirect(string $path): void
    {
        header('Location: ' . \url($path));
        exit;
    }

    protected function requireAuth(): void
    {
        if (!\auth_user()) {
            $this->redirect('/login');
        }
    }

    protected function requireRole(array $roles): void
    {
        $this->requireAuth();

        $role = \auth_role();

        if ($role === 'admin' || in_array($role, $roles, true)) {
            return;
        }

        http_response_code(403);
        $this->view('errors/403', ['title' => 'Acceso restringido']);
        exit;
    }
}
