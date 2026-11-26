<?php

return [
    'name' => 'CliniBox',
    'demo_auth' => getenv('CLINIBOX_DEMO_AUTH') === '1',
    'database' => [
        'host' => getenv('CLINIBOX_DB_HOST') ?: '127.0.0.1',
        'port' => getenv('CLINIBOX_DB_PORT') ?: '3306',
        'name' => getenv('CLINIBOX_DB_NAME') ?: 'clinibox',
        'user' => getenv('CLINIBOX_DB_USER') ?: 'root',
        'password' => getenv('CLINIBOX_DB_PASSWORD') ?: '',
        'charset' => getenv('CLINIBOX_DB_CHARSET') ?: 'utf8mb4',
    ],
    'roles' => [
        'medico' => 'Medico',
        'paciente' => 'Paciente',
        'admin' => 'Administrador',
        'farmacia' => 'Farmacia',
    ],
];

