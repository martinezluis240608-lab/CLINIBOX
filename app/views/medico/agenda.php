<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Agenda semanal</h2>
    <p>Disponibilidad base para programar consultas.</p>
</section>

<div class="module-grid">
    <?php foreach ($schedule as $day): ?>
        <article class="card">
            <h3><?= e($day['day']) ?></h3>
            <p><?= e($day['hours']) ?></p>
            <span class="pill"><?= e($day['status']) ?></span>
        </article>
    <?php endforeach; ?>
</div>
