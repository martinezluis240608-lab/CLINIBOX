<section class="section-header">
    <p class="eyebrow">Administrador</p>
    <h2>Vista general del sistema</h2>
    <p>Acceso completo a usuarios, roles y modulos clinicos.</p>
</section>

<div class="stats-grid">
    <?php foreach ($stats as $stat): ?>
        <article class="stat-card">
            <span><?= e($stat['label']) ?></span>
            <strong><?= e($stat['value']) ?></strong>
        </article>
    <?php endforeach; ?>
</div>

<section class="section-header compact">
    <h2>Usuarios recientes</h2>
</section>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $user): ?>
                <tr>
                    <td><?= e($user['name']) ?></td>
                    <td><?= e($user['role']) ?></td>
                    <td><span class="pill"><?= e($user['status']) ?></span></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
