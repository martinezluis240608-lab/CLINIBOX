<!doctype html>
<html lang="es">
<?php $pageTitle = 'Inventario'; require __DIR__ . '/head.php'; ?>
<body class="admin-body" data-admin-page="inventory">
<div class="admin-shell">
    <?php $section = 'inventory'; require __DIR__ . '/sidebar.php'; ?>
    <main class="admin-main"><div class="admin-content">
        <?php $breadcrumb = 'Inventario'; require __DIR__ . '/topbar.php'; ?>
        <header class="admin-page-heading"><div><p class="admin-eyebrow">Control de stock</p><h1>Inventario</h1><p class="admin-page-description">Registra entradas, salidas y conteos físicos. Cada cambio queda en la bitácora.</p></div><a class="admin-button" href="admin/productos">Nuevo producto</a></header>
        <div class="admin-alert alert-error" role="alert" data-feedback hidden></div>
        <section class="admin-stats admin-inventory-stats">
            <article class="admin-stat-card"><span class="admin-stat-icon icon-blue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19.5h16M6.5 16V9m5.5 7V4m5.5 12v-4"/></svg></span><span class="admin-stat-label">Unidades en inventario</span><strong data-inventory-stat="stock_units">—</strong><small>En <span data-inventory-stat="product_count">—</span> productos</small></article>
            <article class="admin-stat-card"><span class="admin-stat-icon icon-amber" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2.8 19h18.4L12 3Z"/><path d="M12 9v4m0 3h.01"/></svg></span><span class="admin-stat-label">Stock bajo</span><strong data-inventory-stat="low_stock_count">—</strong><small>Productos por revisar</small></article>
            <article class="admin-stat-card"><span class="admin-stat-icon icon-purple" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14m-7-7h14"/></svg></span><span class="admin-stat-label">Trazabilidad</span><strong>Activa</strong><small>Movimientos con responsable</small></article>
        </section>
        <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">EXISTENCIAS</span><h2>Stock por producto</h2><p>Captura entradas, salidas o el resultado de un conteo físico.</p></div><span class="admin-badge badge-neutral"><span data-product-count>0</span> productos</span></div>
            <div class="admin-table-scroll"><table class="admin-table admin-inventory-table"><thead><tr><th>Producto</th><th>SKU</th><th>Existencia</th><th>Nivel mínimo</th><th>Movimiento de stock</th></tr></thead><tbody data-inventory-rows><tr><td colspan="5"><div class="admin-empty-inline"><strong>Cargando inventario...</strong><span>Estamos consultando las existencias.</span></div></td></tr></tbody></table></div>
        </section>
        <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL</span><h2>Movimientos recientes</h2><p>Últimos 50 cambios realizados por el equipo.</p></div></div>
            <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Movimiento</th><th>Producto</th><th>Cantidad</th><th>Motivo</th><th>Responsable</th><th>Fecha</th></tr></thead><tbody data-movement-rows><tr><td colspan="6"><div class="admin-empty-inline"><strong>Cargando historial...</strong><span>Estamos consultando los movimientos.</span></div></td></tr></tbody></table></div>
        </section>
    </div></main>
</div>
</body>
</html>
