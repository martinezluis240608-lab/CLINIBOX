<?php

// Busca automaticamente las clases App\\... en las carpetas de la aplicacion.
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';

    // Ignora clases que pertenecen a otros namespaces.
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }

    // Convierte el namespace en una ruta de archivo dentro de app/.
    $relativeClass = substr($class, strlen($prefix));
    $parts = explode('\\', $relativeClass);

    $folders = [
        'Config' => 'config',
        'Core' => 'core',
        'Controllers' => 'controllers',
        'Models' => 'models',
    ];

    if (isset($folders[$parts[0]])) {
        $parts[0] = $folders[$parts[0]];
    }

    // Incluye la clase solo si su archivo existe.
    $file = APP_PATH . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $parts) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});
