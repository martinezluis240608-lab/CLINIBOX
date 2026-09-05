<?php

return [
    'name' => 'CliniBox',
    'database' => [
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'clinibox',
        'user' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
    ],
    'roles' => [
        'medico' => 'Medico',
        'paciente' => 'Paciente',
        'admin' => 'Administrador',
    ],
];
