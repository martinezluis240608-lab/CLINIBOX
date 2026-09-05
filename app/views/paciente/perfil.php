<section class="section-header">
    <p class="eyebrow">Modulo paciente</p>
    <h2>Mi perfil</h2>
    <p>Informacion personal y medico asignado.</p>
</section>

<div class="profile-grid">
    <?php foreach ($profile as $label => $value): ?>
        <article class="profile-field">
            <span><?= e(str_replace('_', ' ', ucfirst($label))) ?></span>
            <strong><?= e($value) ?></strong>
        </article>
    <?php endforeach; ?>
</div>
