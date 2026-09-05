<?php $error = flash('error'); ?>

<section class="auth-card">
    <div>
        <p class="eyebrow">Acceso de demostracion</p>
        <h2>Elige un rol para entrar</h2>
        <p>
            Esta pantalla simula el inicio de sesion para probar la navegacion.
            Luego podemos conectarla a la tabla de usuarios.
        </p>
    </div>

    <?php if ($error): ?>
        <div class="alert alert-error"><?= e($error) ?></div>
    <?php endif; ?>

    <form method="post" action="<?= e(url('/login')) ?>" class="role-form">
        <label class="role-option">
            <input type="radio" name="role" value="medico" required>
            <span>
                <strong>Medico</strong>
                <small>Gestion clinica completa.</small>
            </span>
        </label>

        <label class="role-option">
            <input type="radio" name="role" value="paciente" required>
            <span>
                <strong>Paciente</strong>
                <small>Consultas, recetas y medicamentos.</small>
            </span>
        </label>

        <label class="role-option">
            <input type="radio" name="role" value="admin" required>
            <span>
                <strong>Administrador</strong>
                <small>Acceso total al sistema.</small>
            </span>
        </label>

        <button class="button" type="submit">Ingresar</button>
    </form>
</section>
