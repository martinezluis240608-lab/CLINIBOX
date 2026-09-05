<section class="auth-card">
    <h1>CliniBox</h1>
    <p>Accede a tu portal clínico.</p>
    <form method="post" action="<?= (require APP_PATH . '/Config/config.php')['base_url'] ?>/login">
        <label for="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required>
        <label for="password">Contraseña</label>
        <input id="password" name="password" type="password" required>
        <button type="submit">Iniciar sesión</button>
    </form>
</section>
