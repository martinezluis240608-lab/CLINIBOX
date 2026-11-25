<!doctype html>
<html lang="es">
<?php $pageTitle = 'Panel de control'; require __DIR__ . '/head.php'; ?>
<body class="admin-body" data-admin-page="summary">
<div class="admin-shell">
    <?php $section = 'summary'; require __DIR__ . '/sidebar.php'; ?>

    <main class="admin-main">
        <div class="admin-content">
            <?php $breadcrumb = 'Resumen'; require __DIR__ . '/topbar.php'; ?>
            <header class="admin-page-heading">
                <div>
                    <p class="admin-eyebrow">Resumen</p>
                    <h1>Panel de control</h1>
                    <p class="admin-page-description">Aquí tienes el estado actual de tu tienda y las tareas que requieren atención.</p>
                </div>
            </header>

            <!-- La vista es HTML; el JavaScript solicita estos valores al endpoint autenticado. -->
            <section class="admin-stats" aria-label="Resumen de inventario">
                <article class="admin-stat-card">
                    <span class="admin-stat-icon icon-teal" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m12 3 8.5 4.7v8.6L12 21l-8.5-4.7V7.7L12 3Z"/><path d="m3.8 7.8 8.2 4.6 8.2-4.6M12 12.5V21"/></svg></span>
                    <span class="admin-stat-label">Productos activos</span><strong data-stat="product_count">—</strong><small>En el catálogo</small>
                </article>
                <article class="admin-stat-card">
                    <span class="admin-stat-icon icon-blue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19.5h16M6.5 16V9m5.5 7V4m5.5 12v-4"/></svg></span>
                    <span class="admin-stat-label">Unidades disponibles</span><strong data-stat="stock_units">—</strong><small>Existencias actuales</small>
                </article>
                <a class="admin-stat-card admin-stat-link" href="admin/inventario">
                    <span class="admin-stat-icon icon-green" data-low-stock-icon aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></svg></span>
                    <span class="admin-stat-label">Stock bajo</span><strong data-stat="low_stock_count">—</strong><small data-low-stock-caption>Consultando inventario...</small>
                </a>
                <a class="admin-stat-card admin-stat-link" href="admin/administradores">
                    <span class="admin-stat-icon icon-purple" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.5 3.5 0 0 1 0 6.7m2 2.2a5.8 5.8 0 0 1 3.2 5.2"/></svg></span>
                    <span class="admin-stat-label">Accesos</span><strong>Administradores</strong><small>Gestiona tu equipo <span aria-hidden="true">→</span></small>
                </a>
            </section>

            <section class="admin-panel">
                <div class="admin-panel-heading">
                    <div><span class="admin-section-kicker">ATENCIÓN NECESARIA</span><h2>Productos por reabastecer</h2><p>Productos activos que alcanzaron el nivel mínimo de stock.</p></div>
                    <a class="admin-text-link" href="admin/inventario">Ir al inventario <span aria-hidden="true">→</span></a>
                </div>
                <div class="admin-empty-state" data-low-stock-empty>
                    <span class="admin-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4.5 4.5L19 7"/></svg></span>
                    <div><strong>Cargando inventario...</strong><p>Estamos consultando los niveles de stock.</p></div>
                </div>
                <div class="admin-table-scroll" data-low-stock-table hidden>
                    <table class="admin-table">
                        <thead><tr><th>Producto</th><th>SKU</th><th>Existencia</th><th>Nivel mínimo</th><th>Estado</th><th></th></tr></thead>
                        <tbody data-low-stock-rows></tbody>
                    </table>
                </div>
            </section>

            <p class="admin-alert alert-error" role="alert" data-dashboard-error hidden></p>

            <section class="admin-quick-grid" aria-label="Accesos rápidos">
                <a class="admin-quick-card quick-products" href="admin/productos">
                    <span class="admin-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m12 3 8.5 4.7v8.6L12 21l-8.5-4.7V7.7L12 3Z"/><path d="m3.8 7.8 8.2 4.6 8.2-4.6"/></svg></span>
                    <span><strong>Gestionar productos</strong><small>Agrega artículos y mantén actualizado el catálogo.</small></span><b aria-hidden="true">→</b>
                </a>
                <a class="admin-quick-card quick-inventory" href="admin/inventario">
                    <span class="admin-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14"/></svg></span>
                    <span><strong>Registrar movimiento</strong><small>Controla las entradas, salidas y ajustes de stock.</small></span><b aria-hidden="true">→</b>
                </a>
            </section>
        </div>
    </main>
</div>
</body>
</html>
