<section class="section-header">
    <p class="eyebrow">Modulo paciente</p>
    <h2>Bitacora de medicamentos</h2>
    <p>Control diario de medicamentos indicados en consulta.</p>
</section>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Medicamento</th>
                <th>Horario</th>
                <th>Tomado</th>
                <th>Notas</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($logs as $log): ?>
                <tr>
                    <td><?= e($log['medicine']) ?></td>
                    <td><?= e($log['schedule']) ?></td>
                    <td><span class="pill"><?= e($log['taken']) ?></span></td>
                    <td><?= e($log['notes']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
