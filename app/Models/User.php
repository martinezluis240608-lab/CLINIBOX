<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class User
{
    public function __construct(private Database $database)
    {
    }

    public function findByEmail(string $email): ?array
    {
        $statement = $this->database->connection()->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        return $statement->fetch() ?: null;
    }
}
