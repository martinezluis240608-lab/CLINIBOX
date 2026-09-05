<section class="section-header">
    <p class="eyebrow">Modulo paciente</p>
    <h2>Mis consultas</h2>
    <p>Citas proximas e historial de atencion medica.</p>
</section>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Medico</th>
                <th>Motivo</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($appointments as $appointment): ?>
                <tr>
                    <td><?= e($appointment['date']) ?></td>
                    <td><?= e($appointment['time']) ?></td>
                    <td><?= e($appointment['doctor']) ?></td>
                    <td><?= e($appointment['reason']) ?></td>
                    <td><span class="pill"><?= e($appointment['status']) ?></span></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
