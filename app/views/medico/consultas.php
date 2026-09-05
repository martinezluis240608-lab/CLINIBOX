<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Consultas del dia</h2>
    <p>Control inicial de citas presenciales y virtuales.</p>
</section>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Tipo</th>
                <th>Modalidad</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($appointments as $appointment): ?>
                <tr>
                    <td><?= e($appointment['time']) ?></td>
                    <td><?= e($appointment['patient']) ?></td>
                    <td><?= e($appointment['type']) ?></td>
                    <td><span class="pill"><?= e($appointment['mode']) ?></span></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
