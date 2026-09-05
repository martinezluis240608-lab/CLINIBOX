<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Recetas emitidas</h2>
    <p>Historial inicial de medicamentos indicados por paciente.</p>
</section>

<div class="toolbar">
    <button class="button" type="button">Nueva receta</button>
</div>

<div class="module-grid">
    <?php foreach ($prescriptions as $prescription): ?>
        <article class="card">
            <h3><?= e($prescription['patient']) ?></h3>
            <p><strong><?= e($prescription['medicine']) ?></strong></p>
            <p><?= e($prescription['dose']) ?></p>
            <span class="muted"><?= e($prescription['date']) ?></span>
        </article>
    <?php endforeach; ?>
</div>
