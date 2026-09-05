<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Expedientes clinicos</h2>
    <p>Resumen de historia clinica por paciente asignado.</p>
</section>

<div class="timeline">
    <?php foreach ($records as $record): ?>
        <article class="timeline-item">
            <span><?= e($record['updated']) ?></span>
            <div>
                <h3><?= e($record['patient']) ?></h3>
                <p><?= e($record['summary']) ?></p>
            </div>
        </article>
    <?php endforeach; ?>
</div>
