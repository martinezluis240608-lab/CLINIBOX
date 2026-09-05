<section class="section-header">
    <p class="eyebrow">Panel de control</p>
    <h2>Hola, <?= e(auth_user()['name'] ?? 'usuario') ?></h2>
    <p>Selecciona un modulo para continuar trabajando en CliniBox.</p>
</section>

<div class="module-grid">
    <?php foreach ($modules as $module): ?>
        <a class="card card-link" href="<?= e(url($module['url'])) ?>">
            <h3><?= e($module['title']) ?></h3>
            <p><?= e($module['description']) ?></p>
            <span>Abrir modulo</span>
        </a>
    <?php endforeach; ?>
</div>
