<?php
declare(strict_types=1);

namespace App\Core;

final class Auth
{
    public static function user(): ?array
    {
        return $_SESSION['user'] ?? null;
    }

    public static function requireRole(string ...$roles): void
    {
        $user = self::user();
        if ($user === null || !in_array($user['role'], $roles, true)) {
            http_response_code($user === null ? 401 : 403);
            exit($user === null ? 'Debes iniciar sesión.' : 'No tienes permiso para acceder.');
        }
    }
}
