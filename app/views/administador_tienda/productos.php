<!doctype html>
<html lang="es">
<?php $pageTitle = 'Productos'; require __DIR__ . '/head.php'; ?>
<body class="admin-body" data-admin-page="products">
<div class="admin-shell">
    <?php $section = 'products'; require __DIR__ . '/sidebar.php'; ?>
    <main class="admin-main">
        <div class="admin-content">
            <?php $breadcrumb = 'Productos'; require __DIR__ . '/topbar.php'; ?>
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Catálogo</p><h1>Productos</h1><p class="admin-page-description">Administra los artículos, precios y disponibilidad de tu tienda.</p></div><a class="admin-button" href="admin/productos#product-form">Agregar producto</a></header>
            <div class="admin-alert alert-error" role="alert" data-feedback hidden></div>
            <section class="admin-panel admin-form-panel" id="product-form">
                <div class="admin-panel-heading"><div><span class="admin-section-kicker" data-product-kicker>NUEVO ARTÍCULO</span><h2 data-product-form-title>Agregar producto</h2><p>Los movimientos de existencias se gestionan desde Inventario.</p></div><a class="admin-button admin-button-light" href="admin/productos" data-cancel-edit hidden>Cancelar</a></div>
                <form class="admin-form-grid" action="admin/productos/guardar" method="post">
                    <input type="hidden" name="csrf_token" data-csrf-token>
                    <input type="hidden" name="id" value="0">
                    <label class="admin-field"><span>Nombre del producto <i>*</i></span><input name="nombre" maxlength="160" placeholder="Ej. Guantes de nitrilo" required></label>
                    <label class="admin-field"><span>SKU / Código <i>*</i></span><input name="sku" maxlength="60" placeholder="Ej. GNT-001" required></label>
                    <label class="admin-field"><span>Categoría <i>*</i></span><input name="categoria" maxlength="120" placeholder="Ej. Protección" required></label>
                    <label class="admin-field"><span>Precio de venta (MXN) <i>*</i></span><span class="admin-input-prefix"><b>$</b><input type="number" name="precio" min="0" step="0.01" placeholder="0.00" required></span></label>
                    <label class="admin-field"><span>Stock mínimo</span><input type="number" name="stock_minimo" min="0" step="1" value="5" required><small>Recibirás una alerta al llegar a este nivel.</small></label>
                    <label class="admin-field" data-initial-stock-field><span>Existencia inicial</span><input type="number" name="stock_inicial" min="0" step="1" value="0" required><small>Este ingreso quedará registrado en la bitácora.</small></label>
                    <label class="admin-field admin-field-wide"><span>Descripción <small>(opcional)</small></span><textarea name="descripcion" rows="3" placeholder="Describe brevemente el producto"></textarea></label>
                    <label class="admin-toggle-row"><input type="checkbox" name="activo" value="1" checked><span class="admin-toggle" aria-hidden="true"></span><span><strong>Producto disponible</strong><small>Visible y habilitado para la tienda.</small></span></label>
                    <div class="admin-form-actions"><button class="admin-button" type="submit">Guardar producto <span aria-hidden="true">→</span></button></div>
                </form>
            </section>
            <section class="admin-panel">
                <div class="admin-panel-heading admin-catalog-heading"><div><span class="admin-section-kicker">INVENTARIO DE LA TIENDA</span><h2>Catálogo de productos <span class="admin-count" data-product-count>0</span></h2><p>Consulta, busca y edita los artículos registrados.</p></div>
                    <form class="admin-search" action="admin/productos" method="get"><label class="sr-only" for="buscar-producto">Buscar por nombre, SKU o categoría</label><span class="admin-search-input"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input id="buscar-producto" type="search" name="buscar" placeholder="Buscar producto..."></span><button class="admin-button admin-button-light" type="submit">Buscar</button></form>
                </div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Existencia</th><th>Estado</th><th></th></tr></thead><tbody data-product-rows><tr><td colspan="7"><div class="admin-empty-inline"><strong>Cargando catálogo...</strong><span>Estamos consultando los productos.</span></div></td></tr></tbody></table></div>
                <div class="admin-table-footer">Mostrando <strong data-product-count>0</strong> productos</div>
            </section>
        </div>
    </main>
</div>
</body>
</html>
