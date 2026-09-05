<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
    public function __construct(private array $routes)
    {
    }

    public function dispatch(string $method, string $requestUri): void
    {
        $path = parse_url($requestUri, PHP_URL_PATH) ?: '/';
        $basePath = rtrim((require APP_PATH . '/Config/config.php')['base_url'], '/');
        $path = '/' . ltrim(substr($path, strlen($basePath)), '/');
        $path = $path === '//' ? '/' : (rtrim($path, '/') ?: '/');

        $handler = $this->routes[$method][$path] ?? null;
        if ($handler === null) {
            http_response_code(404);
            echo 'Página no encontrada.';
            return;
        }

        [$controller, $action] = $handler;
        (new $controller())->{$action}();
    }
}
