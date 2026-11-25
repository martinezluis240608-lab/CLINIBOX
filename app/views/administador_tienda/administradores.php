<!doctype html>
<html lang="es">
<?php $pageTitle = 'Administradores'; require __DIR__ . '/head.php'; ?>
<body class="admin-body" data-admin-page="administrators">
<div class="admin-shell">
    <?php $section = 'administrators'; require __DIR__ . '/sidebar.php'; ?>
    <main class="admin-main"><div class="admin-content">
        <?php $breadcrumb = 'Administradores'; require __DIR__ . '/topbar.php'; ?>
        <header class="admin-page-heading"><div><p class="admin-eyebrow">Equipo</p><h1>Administradores</h1><p class="admin-page-description">Controla quién tiene acceso para gestionar la operación de tu tienda.</p></div><a class="admin-button" href="admin/administradores#new-admin">Agregar administrador</a></header>
        <div class="admin-alert alert-error" role="alert" data-feedback hidden></div>
        <section class="admin-team-banner"><span class="admin-team-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.5 3.5 0 0 1 0 6.7m2 2.2a5.8 5.8 0 0 1 3.2 5.2"/></svg></span><span><strong>Acceso seguro para tu equipo</strong><small>Cada persona administradora tiene credenciales individuales. Nunca compartas contraseñas entre cuentas.</small></span></section>
        <section class="admin-panel admin-form-panel" id="new-admin"><div class="admin-panel-heading"><div><span class="admin-section-kicker">INVITAR A TU EQUIPO</span><h2>Agregar administrador</h2><p>Crea una cuenta nueva con acceso al panel de la tienda.</p></div></div>
            <form class="admin-form-grid admin-user-form" action="admin/administradores" method="post">
                <input type="hidden" name="csrf_token" data-csrf-token>
                <label class="admin-field"><span>Nombre completo <i>*</i></span><input name="nombre" maxlength="120" autocomplete="name" placeholder="Nombre y apellido" required></label>
                <label class="admin-field"><span>Correo electrónico <i>*</i></span><input type="email" name="email" maxlength="160" autocomplete="email" placeholder="nombre@clinibox.com" required></label>
                <label class="admin-field"><span>Contraseña temporal <i>*</i></span><input type="password" name="password" minlength="12" autocomplete="new-password" placeholder="Mínimo 12 caracteres" required><small>La contraseña debe tener al menos 12 caracteres.</small></label>
                <div class="admin-form-actions"><button class="admin-button" type="submit">Crear cuenta <span aria-hidden="true">→</span></button></div>
            </form>
        </section>
        <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">ACCESO A LA TIENDA</span><h2>Cuentas activas <span class="admin-count" data-admin-count>0</span></h2><p>Personas con permisos administrativos.</p></div></div>
            <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Administrador</th><th>Correo electrónico</th><th>Fecha de alta</th><th>Estado</th></tr></thead><tbody data-admin-rows><tr><td colspan="4"><div class="admin-empty-inline"><strong>Cargando administradores...</strong><span>Estamos consultando las cuentas activas.</span></div></td></tr></tbody></table></div>
            <div class="admin-table-footer">Mostrando <strong data-admin-count>0</strong> administradores activos</div>
        </section>
    </div></main>
</div>
</body>
</html>
