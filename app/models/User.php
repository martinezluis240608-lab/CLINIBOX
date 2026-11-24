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

    public function findByLogin(string $identifier): ?array
    {
        $statement = $this->db->prepare(
            'SELECT * FROM usuarios
             WHERE email = :email OR (rol = \'admin\' AND nombre = :nombre)
             ORDER BY CASE WHEN email = :email_order THEN 0 ELSE 1 END
             LIMIT 1'
        );
        $statement->execute([
            'email' => $identifier,
            'nombre' => $identifier,
            'email_order' => $identifier,
        ]);
        $user = $statement->fetch();

        return $user ?: null;
    }

    public function countActiveAdmins(): int
    {
        $statement = $this->db->query("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin' AND estado = 'activo'");

        return (int) $statement->fetchColumn();
    }

    public function activeAdmins(): array
    {
        $statement = $this->db->query(
            "SELECT id, nombre, email, created_at FROM usuarios WHERE rol = 'admin' AND estado = 'activo' ORDER BY nombre"
        );

        return $statement->fetchAll();
    }

    public function createAdmin(string $name, string $email, string $password): void
    {
        $statement = $this->db->prepare(
            "INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (:nombre, :email, :password, 'admin', 'activo')"
        );
        $statement->execute([
            'nombre' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
        ]);
    }
}
