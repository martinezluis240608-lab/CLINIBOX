<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($title) ?> | CliniBox</title>
    <link rel="stylesheet" href="<?= e(asset('css/app.css')) ?>">
<link rel="stylesheet" href="/CLINIBOX/public/assets/css/profile-menu.css?v=3">
<script src="/CLINIBOX/public/assets/js/profile-menu.js?v=2" defer></script>
    <link rel="stylesheet" href="/CLINIBOX/public/assets/css/clinibox.css?v=5">
    <script src="/CLINIBOX/public/assets/js/page-size.js?v=1" defer></script>
</head>
<body>
    <main class="page-shell">
        <clinibox-profile-menu data-label="<?= e(role_name(auth_role())) ?>"<?= auth_role() === 'medico' ? ' data-profile="medico/perfil"' : '' ?>></clinibox-profile-menu>
        <h1><?= e($title) ?></h1>
        <nav class="module-grid" aria-label="Módulos disponibles">
            <?php foreach ($modules as $module): ?>
                <a class="card card-link" href="<?= e(url($module['url'])) ?>">
                    <h2><?= e($module['title']) ?></h2>
                    <p><?= e($module['description']) ?></p>
                </a>
            <?php endforeach; ?>
        </nav>
    </main>
</body>
</html>
