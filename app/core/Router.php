<?php

namespace App\Core;

class Router
{
    // Guarda controladores por metodo HTTP y ruta normalizada.
    private array $routes = [
        'GET' => [],
        'POST' => [],
    ];

    public function get(string $path, $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function dispatch(string $method, string $uri): void
    {
        // Normaliza la solicitud, encuentra su destino y responde con 404 si no existe.
        $method = strtoupper($method);
        $path = $this->normalizePath($uri);
        $handler = $this->routes[$method][$path] ?? null;

        if ($handler === null) {
            http_response_code(404);
            $this->call([\App\Controllers\ErrorController::class, 'notFound']);
            return;
        }

        $this->call($handler);
    }

    private function add(string $method, string $path, $handler): void
    {
        // Registra la pareja metodo/ruta que se ejecutara cuando llegue una solicitud.
        $path = '/' . trim($path, '/');
        $this->routes[$method][$path === '//' ? '/' : $path] = $handler;
    }

    private function normalizePath(string $uri): string
    {
        // Quita query string y prefijo del proyecto para comparar rutas consistentes.
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $base = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
        $base = rtrim($base, '/');

        if ($base !== '' && $base !== '/' && strpos($path, $base) === 0) {
            $path = substr($path, strlen($base));
        }

        $path = '/' . trim($path, '/');

        return $path === '//' ? '/' : $path;
    }

    private function call($handler): void
    {
        // Ejecuta acciones de controlador o funciones registradas como manejadores.
        if (is_array($handler)) {
            [$class, $method] = $handler;
            $controller = new $class();
            $controller->{$method}();
            return;
        }

        if (is_callable($handler)) {
            $handler();
            return;
        }

        throw new \RuntimeException('La ruta no tiene un controlador valido.');
    }
}
