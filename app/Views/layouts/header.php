<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($title ?? 'CliniBox', ENT_QUOTES, 'UTF-8') ?> | CliniBox</title>
    <link rel="stylesheet" href="<?= (require APP_PATH . '/Config/config.php')['base_url'] ?>/assets/css/app.css">
</head>
<body>
<main class="container">
