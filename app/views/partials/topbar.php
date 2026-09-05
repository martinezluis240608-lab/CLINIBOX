<header class="topbar">
    <div>
        <p class="eyebrow"><?= e(role_name(auth_role())) ?></p>
        <h1><?= e($title ?? config('name')) ?></h1>
    </div>

    <?php if (auth_user()): ?>
        <div class="user-menu">
            <span><?= e(auth_user()['name']) ?></span>
            <form method="post" action="<?= e(url('/logout')) ?>">
                <button class="button button-ghost" type="submit">Salir</button>
            </form>
        </div>
    <?php else: ?>
        <a class="button" href="<?= e(url('/login')) ?>">Iniciar sesion</a>
    <?php endif; ?>
</header>
