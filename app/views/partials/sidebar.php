<?php
$user = auth_user();
$role = auth_role();

$nav = [
    ['label' => 'Inicio', 'url' => '/'],
];

if ($user) {
    $nav[] = ['label' => 'Panel', 'url' => '/dashboard'];

    if ($role === 'medico' || $role === 'admin') {
        $nav = array_merge($nav, [
            ['label' => 'Pacientes', 'url' => '/medico/pacientes'],
            ['label' => 'Consultas medicas', 'url' => '/medico/consultas'],
            ['label' => 'Recetas medicas', 'url' => '/medico/recetas'],
            ['label' => 'Expedientes', 'url' => '/medico/expedientes'],
            ['label' => 'Agenda medica', 'url' => '/medico/agenda'],
            ['label' => 'Mensajes medico', 'url' => '/medico/mensajes'],
            ['label' => 'Perfil medico', 'url' => '/medico/perfil'],
        ]);
    }

    if ($role === 'paciente' || $role === 'admin') {
        $nav = array_merge($nav, [
            ['label' => 'Mis consultas', 'url' => '/paciente/consultas'],
            ['label' => 'Medicamentos', 'url' => '/paciente/medicamentos'],
            ['label' => 'Mensajes paciente', 'url' => '/paciente/mensajes'],
            ['label' => 'Mis recetas', 'url' => '/paciente/recetas'],
            ['label' => 'Perfil paciente', 'url' => '/paciente/perfil'],
        ]);
    }

    if ($role === 'admin') {
        $nav[] = ['label' => 'Administracion', 'url' => '/admin'];
    }
} else {
    $nav[] = ['label' => 'Iniciar sesion', 'url' => '/login'];
}
?>

<aside class="sidebar">
    <a class="brand" href="<?= e(url('/')) ?>">
        <span class="brand-mark">CB</span>
        <span>
            <strong>CliniBox</strong>
            <small>Sistema clinico</small>
        </span>
    </a>

    <nav class="nav-list" aria-label="Navegacion principal">
        <?php foreach ($nav as $item): ?>
            <a class="<?= is_active($item['url']) ? 'active' : '' ?>" href="<?= e(url($item['url'])) ?>">
                <?= e($item['label']) ?>
            </a>
        <?php endforeach; ?>
    </nav>
</aside>
