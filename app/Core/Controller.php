<?php
declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    protected function view(string $view, array $data = []): void
    {
        extract($data, EXTR_SKIP);
        $viewFile = APP_PATH . '/Views/' . $view . '.php';
        if (!is_file($viewFile)) {
            throw new \RuntimeException("Vista no encontrada: {$view}");
        }
        require APP_PATH . '/Views/layouts/header.php';
        require $viewFile;
        require APP_PATH . '/Views/layouts/footer.php';
    }

    protected function redirect(string $path): never
    {
        $baseUrl = (require APP_PATH . '/Config/config.php')['base_url'];
        header('Location: ' . $baseUrl . $path);
        exit;
    }
}
