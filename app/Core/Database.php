<?php
declare(strict_types=1);

namespace App\Core;

use PDO;

final class Database
{
    private PDO $connection;

    public function __construct()
    {
        $config = require APP_PATH . '/Config/database.php';
        $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
        $this->connection = new PDO($dsn, $config['username'], $config['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    public function connection(): PDO
    {
        return $this->connection;
    }
}
