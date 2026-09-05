<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Perfil profesional</h2>
    <p>Datos principales del medico que atiende pacientes en CliniBox.</p>
</section>

<div class="profile-grid">
    <?php foreach ($profile as $label => $value): ?>
        <article class="profile-field">
            <span><?= e(str_replace('_', ' ', ucfirst($label))) ?></span>
            <strong><?= e($value) ?></strong>
        </article>
    <?php endforeach; ?>
</div>
