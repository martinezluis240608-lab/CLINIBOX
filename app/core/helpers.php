<?php

function config(?string $key = null, $default = null)
{
    $config = $GLOBALS['config'] ?? [];

    if ($key === null) {
        return $config;
    }

    foreach (explode('.', $key) as $segment) {
        if (!is_array($config) || !array_key_exists($segment, $config)) {
            return $default;
        }

        $config = $config[$segment];
    }

    return $config;
}

function url(string $path = ''): string
{
    $base = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    $base = rtrim($base, '/');

    if ($base === '.') {
        $base = '';
    }

    $path = trim($path, '/');

    return $base . ($path === '' ? '/' : '/' . $path);
}

function asset(string $path): string
{
    return url('assets/' . ltrim($path, '/'));
}

function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function auth_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function auth_role(): ?string
{
    return $_SESSION['user']['role'] ?? null;
}

function role_name(?string $role): string
{
    if ($role === null) {
        return 'Invitado';
    }

    return config('roles.' . $role, ucfirst($role));
}

function is_active(string $path): bool
{
    $current = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/', '/');
    $target = trim(url($path), '/');

    return $current === $target || strpos($current, $target . '/') === 0;
}

function flash(string $key): ?string
{
    $message = $_SESSION['flash'][$key] ?? null;
    unset($_SESSION['flash'][$key]);

    return $message;
}

function set_flash(string $key, string $message): void
{
    $_SESSION['flash'][$key] = $message;
}
