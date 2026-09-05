<?php

namespace App\Models;

class User extends Model
{
    protected string $table = 'usuarios';

    public function findByEmail(string $email): ?array
    {
        $statement = $this->db->prepare('SELECT * FROM usuarios WHERE email = :email LIMIT 1');
        $statement->execute(['email' => $email]);
        $user = $statement->fetch();

        return $user ?: null;
    }
}
