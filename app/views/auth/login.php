<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Iniciar Sesión | CliniBox</title>
<link rel="stylesheet" href="/CLINIBOX/public/assets/css/login_medico.css?v=20261113.1">
<link rel="stylesheet" href="../../public/assets/css/login_medico.css?v=20261113.1">
    <link rel="stylesheet" href="/CLINIBOX/public/assets/css/clinibox.css?v=5">
    <script src="/CLINIBOX/public/assets/js/page-size.js?v=1" defer></script>
</head>
<body class="auth-page">

<div class="auth-shell">

    <!-- LADO IZQUIERDO: BRANDING -->
    <aside class="auth-brand">
        <div class="auth-brand-content">
            <a href="/CLINIBOX/" class="auth-logo" style="text-decoration:none;color:inherit;" title="Volver al inicio">
                <div class="brand-mark" style="background: linear-gradient(135deg, #278dd1, #54bce8); color: white;">✚</div>
                <div>
                    <strong>CliniBox</strong>
                    <small>Centro Médico Digital</small>
                </div>
            </a>

            <div class="brand-card">
                <h1>Bienvenido a CliniBox</h1>
                <p>Accede a tu portal médico y gestiona citas, consultas, expedientes y recetas con atención segura y confiable.</p>

                <ul class="auth-features">
                    <li>✅ Historial clínico seguro y confidencial</li>
                    <li>✅ Agenda y citas médicas en tiempo real</li>
                    <li>✅ Portal unificado para Médicos y Pacientes</li>
                </ul>
            </div>
        </div>
        <div class="auth-brand-footer">
            © 2026 CliniBox · Tu salud, nuestra prioridad
        </div>
    </aside>

    <!-- LADO DERECHO: FORMULARIO -->
    <main class="auth-form-side">
        <div class="auth-card">

            <div class="auth-header">
                <p class="eyebrow">Acceso seguro</p>
                <h2 id="formTitle">Iniciar sesión</h2>
                <p id="formSubtitle">Ingresa con tu correo y contraseña</p>
            </div>
<!-- FORMULARIO DE LOGIN -->
            <form id="loginForm" method="POST" action="/CLINIBOX/public/login">
<div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="tucorreo@clinibox.com" required autocomplete="email">
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="input-password">
                        <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
                        <button type="button" class="toggle-pass" onclick="togglePassword()" aria-label="Mostrar contraseña">
                            👁️
                        </button>
                    </div>
                </div>

                <div class="row-between">
                    <label class="remember">
                        <input type="checkbox" id="remember" name="remember"> Recordarme
                    </label>
                    <a href="#" class="link-forgot" onclick="openForgot(event)">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" class="btn-primary btn-block">
                    Iniciar sesión
                </button>

                <p class="auth-footnote">
                    ¿No tienes cuenta? <a href="#" onclick="openRegister(event)">Regístrate aquí</a>
                </p>
            </form>

        </div>
    </main>

</div>

<!-- MODAL: OLVIDÉ MI CONTRASEÑA -->
<div class="modal-overlay" id="forgotModal">
    <div class="modal-card">
        <div class="modal-header">
            <h3>Recuperar contraseña</h3>
            <button class="close-btn" onclick="closeForgot()">&times;</button>
        </div>
        <form onsubmit="handleForgot(event)">
            <div class="modal-body">
                <p style="margin:0;color:var(--text-muted);font-size:.92rem;line-height:1.5;">
                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div class="form-group">
                    <label for="forgotEmail">Correo electrónico</label>
                    <input type="email" id="forgotEmail" class="form-control" placeholder="tucorreo@clinica.com" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeForgot()">Cancelar</button>
                <button type="submit" class="btn-primary">Enviar enlace</button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: REGISTRO -->
<div class="modal-overlay" id="registerModal">
    <div class="modal-card">
        <div class="modal-header">
            <h3>Registro temporal de paciente</h3>
            <button class="close-btn" onclick="closeRegister()">&times;</button>
        </div>
        <form method="post" action="/CLINIBOX/public/registro-demo">
            <div class="modal-body">
                <p>El registro de demostración dura hasta que cierres sesión. Para volver a entrar, puedes usar paciente@demo.com con la contraseña 123456.</p>
                <div class="form-group">
                    <label for="regName">Nombre completo *</label>
                    <input type="text" id="regName" name="name" class="form-control" maxlength="120" required>
                </div>
                <div class="form-group">
                    <label for="regEmail">Correo electrónico *</label>
                    <input type="email" id="regEmail" name="email" class="form-control" maxlength="160" required>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeRegister()">Cancelar</button>
                <button type="submit" class="btn-primary">Registrarme</button>
            </div>
        </form>
    </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<script>
    function togglePassword() {
        const input = document.getElementById('password');
        input.type = input.type === 'password' ? 'text' : 'password';
    }

    function openForgot(e) {
        e.preventDefault();
        document.getElementById('forgotModal').classList.add('active');
    }
    function closeForgot() {
        document.getElementById('forgotModal').classList.remove('active');
    }
    function handleForgot(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        showToast(`Enlace enviado a ${email}`, 'success');
        closeForgot();
        e.target.reset();
    }

    function openRegister(e) {
        if (e) e.preventDefault();
        document.getElementById('registerModal').classList.add('active');
    }
    function closeRegister() {
        document.getElementById('registerModal').classList.remove('active');
    }
    let toastTimer;
    function showToast(msg, type = 'info') {
        const t = document.getElementById('toast');
        t.textContent = msg;
        t.className = `toast show ${type}`;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
    }

    const loginParams = new URLSearchParams(window.location.search);
    const loginError = loginParams.get("error");
    if (loginError === "1" || loginError === "credenciales") showToast("Correo o contraseña incorrectos.", "error");
    if (loginError === "servicio") showToast("El servicio de acceso no está disponible.", "error");
    if (loginError === "registro") showToast("No se pudo completar el registro temporal.", "error");
    if (loginParams.get("registro") === "1") openRegister();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeForgot();
            closeRegister();
        }
    });
</script>

</body>
</html>

