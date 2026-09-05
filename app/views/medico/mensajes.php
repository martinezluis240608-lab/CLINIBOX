<section class="section-header">
    <p class="eyebrow">Modulo medico</p>
    <h2>Consultas virtuales</h2>
    <p>Mensajes recientes enviados por pacientes.</p>
</section>

<div class="message-list">
    <?php foreach ($messages as $message): ?>
        <article class="message-row">
            <div>
                <h3><?= e($message['patient']) ?></h3>
                <p><?= e($message['message']) ?></p>
            </div>
            <span><?= e($message['time']) ?></span>
        </article>
    <?php endforeach; ?>
</div>
