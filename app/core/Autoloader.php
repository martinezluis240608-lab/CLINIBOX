<?php

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';

    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }

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

    $file = APP_PATH . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $parts) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});
