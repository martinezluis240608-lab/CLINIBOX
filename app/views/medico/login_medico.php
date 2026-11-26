<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acceso | CliniBox</title>
<link rel="stylesheet" href="/CLINIBOX/public/assets/css/login_medico.css?v=20261126.1">
<link rel="stylesheet" href="/CLINIBOX/public/assets/css/clinibox.css?v=5">
<script src="/CLINIBOX/public/assets/js/page-size.js?v=1" defer></script>
</head>
<body class="auth-page">
<main class="auth-shell" id="authShell">
    <section class="form-panel login-panel" aria-label="Iniciar sesión">
        <a class="brand" href="/CLINIBOX/index.html" aria-label="CliniBox, inicio">
            <span class="brand-icon">♡</span><span><strong>CliniBox</strong><small>Tu salud, nuestra prioridad</small></span>
        </a>
        <form class="auth-form login-form" method="POST" action="/CLINIBOX/public/login">
            <h1>LOGIN</h1>
            <p class="form-intro">Ingresa con tu correo y contraseña</p>
            <p id="loginError" class="register-notice" role="alert">No se pudo iniciar sesión. Revisa tu correo y contraseña o intenta de nuevo más tarde.</p>
            <label for="loginEmail">Correo electrónico</label>
            <input id="loginEmail" name="email" type="email" autocomplete="username" placeholder="tucorreo@clinica.com" required>
            <label for="loginPassword">Contraseña</label>
            <div class="password-field"><input id="loginPassword" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required><button type="button" class="toggle-password" data-target="loginPassword" aria-label="Mostrar contraseña">◉</button></div>
            <a class="forgot-link" href="/CLINIBOX/public/login">¿Olvidaste tu contraseña?</a>
            <button class="submit-button" type="submit">Iniciar sesión</button>
            <p class="mobile-switch">¿No tienes una cuenta? <button type="button" data-show-register>Registrar</button></p>
        </form>
    </section>

    <section class="form-panel register-panel" aria-label="Registro">
        <a class="brand" href="/CLINIBOX/index.html" aria-label="CliniBox, inicio">
            <span class="brand-icon">♡</span><span><strong>CliniBox</strong><small>Tu salud, nuestra prioridad</small></span>
        </a>
        <form class="auth-form register-form" id="registerForm" method="POST" action="/CLINIBOX/public/registro">
            <input type="hidden" name="csrf_token" value="<?= e($csrfToken ?? '') ?>">
            <h1>REGISTRAR</h1>
            <p class="form-intro">Crea una cuenta para acceder a CliniBox</p>
            <label for="accountType">Tipo de cuenta</label>
            <select id="accountType" name="tipo_cuenta" class="account-type-select">
                <option value="paciente">Paciente</option>
                <option value="medico">Médico</option>
            </select>
            <label for="registerName">Nombre completo</label>
            <input id="registerName" name="nombre" type="text" autocomplete="name" maxlength="120" placeholder="Tu nombre" required>
            <label for="registerEmail">Correo electrónico</label>
            <input id="registerEmail" name="email" type="email" autocomplete="email" maxlength="160" placeholder="tucorreo@clinica.com" required>
            <label for="registerPassword">Contraseña</label>
            <div class="password-field"><input id="registerPassword" name="password" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres" minlength="6" maxlength="200" required><button type="button" class="toggle-password" data-target="registerPassword" aria-label="Mostrar contraseña">◉</button></div>
            <div id="doctorFields" hidden>
                <label for="doctorLicense">Cédula profesional</label>
                <input id="doctorLicense" name="cedula_profesional" type="text" maxlength="40" autocomplete="off">
                <label for="doctorSpecialty">Especialidad</label>
                <input id="doctorSpecialty" name="especialidad" type="text" maxlength="120" placeholder="Medicina general">
                <label for="doctorPhone">Teléfono (opcional)</label>
                <input id="doctorPhone" name="telefono" type="tel" maxlength="30" autocomplete="tel">
            </div>
            <button class="submit-button" type="submit">Crear cuenta</button>
            <p class="mobile-switch">¿Ya tienes una cuenta? <button type="button" data-show-login>Login</button></p>
            <p class="register-notice" id="registerNotice" role="status"><?= e($error ?: 'Las cuentas se guardan en la base de datos. El médico deberá indicar su cédula profesional y especialidad.') ?></p>
        </form>
    </section>

    <div class="blue-pane" aria-live="polite">
        <a class="pane-brand" href="/CLINIBOX/index.html"><span class="brand-icon">♡</span><span><strong>CliniBox</strong><small>Tu salud, nuestra prioridad</small></span></a>
        <div class="pane-copy pane-login-copy"><h2>Hola, bienvenido a CliniBox</h2><p>¿No tienes una cuenta?</p><button type="button" class="outline-button" data-show-register>Registrar</button></div>
        <div class="pane-copy pane-register-copy"><h2>¡Bienvenido de nuevo!</h2><p>¿Ya tienes una cuenta?</p><button type="button" class="outline-button" data-show-login>Login</button></div>
    </div>
</main>
<script>
(() => {
    const shell = document.getElementById('authShell');
    const params = new URLSearchParams(window.location.search);
    const registrationError = <?= json_encode((string) ($error ?? ''), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;

    if (params.get('error') === '1') {
        document.getElementById('loginError').classList.add('visible');
    }
    if (params.get('registro') === '1') {
        shell.classList.add('show-register');
    }
    if (registrationError) {
        const notice = document.getElementById('registerNotice');
        notice.textContent = registrationError;
        notice.classList.add('visible');
        shell.classList.add('show-register');
    }

    document.querySelectorAll('[data-show-register]').forEach(button => button.addEventListener('click', () => shell.classList.add('show-register')));
    document.querySelectorAll('[data-show-login]').forEach(button => button.addEventListener('click', () => shell.classList.remove('show-register')));
    document.querySelectorAll('.toggle-password').forEach(button => button.addEventListener('click', () => {
        const input = document.getElementById(button.dataset.target);
        input.type = input.type === 'password' ? 'text' : 'password';
    }));

    const accountType = document.getElementById('accountType');
    const doctorFields = document.getElementById('doctorFields');
    const doctorLicense = document.getElementById('doctorLicense');
    const doctorSpecialty = document.getElementById('doctorSpecialty');
    const syncAccountFields = () => {
        const isDoctor = accountType.value === 'medico';
        doctorFields.hidden = !isDoctor;
        doctorLicense.required = isDoctor;
        doctorSpecialty.required = isDoctor;
    };
    accountType.addEventListener('change', syncAccountFields);
    syncAccountFields();
})();
</script>
</body>
</html>
