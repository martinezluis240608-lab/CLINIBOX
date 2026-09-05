<section class="hero">
    <div class="hero-copy">
        <p class="eyebrow">Estructura MVC para XAMPP</p>
        <h2>CliniBox</h2>
        <p>
            Base inicial para administrar medicos, pacientes, consultas, recetas,
            expedientes clinicos, agenda y comunicacion por mensajes.
        </p>
        <div class="actions">
            <a class="button" href="<?= e(url('/login')) ?>">Entrar al sistema</a>
            <a class="button button-secondary" href="<?= e(url('/dashboard')) ?>">Ver panel</a>
        </div>
    </div>

    <div class="hero-panel">
        <span class="status-dot"></span>
        <h3>Flujo principal</h3>
        <p>Ruta, controlador, modelo y vista quedan separados desde el inicio.</p>
    </div>
</section>

<section class="section-header">
    <p class="eyebrow">Roles del sistema</p>
    <h2>Modulos iniciales</h2>
</section>

<div class="role-grid">
    <?php foreach ($roles as $role): ?>
        <article class="card">
            <h3><?= e($role['name']) ?></h3>
            <p><?= e($role['description']) ?></p>
        </article>
    <?php endforeach; ?>
</div>
