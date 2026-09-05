<section class="section-header">
    <p class="eyebrow">Modulo paciente</p>
    <h2>Consulta rapida</h2>
    <p>Conversacion de ejemplo con el medico asignado.</p>
</section>

<div class="chat-window">
    <?php foreach ($thread as $message): ?>
        <article class="chat-bubble <?= $message['from'] === 'Paciente' ? 'mine' : '' ?>">
            <span><?= e($message['from']) ?> - <?= e($message['time']) ?></span>
            <p><?= e($message['message']) ?></p>
        </article>
    <?php endforeach; ?>

    <form class="chat-form">
        <input type="text" placeholder="Escribe un mensaje" aria-label="Mensaje">
        <button class="button" type="button">Enviar</button>
    </form>
</div>
