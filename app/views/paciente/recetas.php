<section class="section-header">
    <p class="eyebrow">Modulo paciente</p>
    <h2>Historial de recetas</h2>
    <p>Recetas medicas emitidas por el medico tratante.</p>
</section>

<div class="module-grid">
    <?php foreach ($prescriptions as $prescription): ?>
        <article class="card">
            <h3><?= e($prescription['medicine']) ?></h3>
            <p><?= e($prescription['indications']) ?></p>
            <span class="muted"><?= e($prescription['doctor']) ?> - <?= e($prescription['date']) ?></span>
        </article>
    <?php endforeach; ?>
</div>
