<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Pacientes a cargo</h2>
    <p>Listado base para registrar, consultar y dar seguimiento a pacientes.</p>
</section>

<div class="toolbar">
    <button class="button" type="button">Nuevo paciente</button>
    <button class="button button-secondary" type="button">Exportar</button>
</div>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>Paciente</th>
                <th>Edad</th>
                <th>Condicion</th>
                <th>Ultima visita</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($patients as $patient): ?>
                <tr>
                    <td><?= e($patient['name']) ?></td>
                    <td><?= e($patient['age']) ?></td>
                    <td><?= e($patient['condition']) ?></td>
                    <td><?= e($patient['last_visit']) ?></td>
                    <td><span class="pill"><?= e($patient['status']) ?></span></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
