<?php

return [
    'name' => 'CliniBox',
    'demo_auth' => getenv('CLINIBOX_DEMO_AUTH') === '1',
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
        'farmacia' => 'Farmacia',
    ],
];

