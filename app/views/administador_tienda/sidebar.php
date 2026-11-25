<aside class="admin-sidebar">
        <clinibox-profile-menu data-label="Administración"></clinibox-profile-menu>
        <div class="admin-nav-caption">TIENDA</div>
        <nav class="admin-nav" aria-label="Navegación administrativa">
            <a href="admin"<?= $section === 'summary' ? ' class="active" aria-current="page"' : '' ?>>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>
                <span>Inicio</span><span class="admin-nav-indicator"></span>
            </a>
            <a href="admin/productos"<?= $section === 'products' ? ' class="active" aria-current="page"' : '' ?>>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8.5 4.7v8.6L12 21l-8.5-4.7V7.7L12 3Z"/><path d="m3.8 7.8 8.2 4.6 8.2-4.6M12 12.5V21"/></svg>
                <span>Productos</span><span class="admin-nav-indicator"></span>
            </a>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Ventas, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M8 9h8m-8 4h5"/></svg><span>Ventas</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Clientes, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.5 3.5 0 0 1 0 6.7m2 2.2a5.8 5.8 0 0 1 3.2 5.2"/></svg><span>Clientes</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Reportes, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg><span>Reportes</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Compras y Gastos, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h18v13H3zM7 7V4h10v3m-6 4v5m-2.5-2.5h5"/></svg><span>Compras y Gastos</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Facturación, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6m-6 4h6"/></svg><span>Facturación</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Empleados IA, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="5"/></svg><span>Empleados IA</span>
            </span>
            <a href="admin/inventario"<?= $section === 'inventory' ? ' class="active" aria-current="page"' : '' ?>>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5h16M6.5 16V9m5.5 7V4m5.5 12v-4"/><circle cx="6.5" cy="7" r="2"/><circle cx="12" cy="2.8" r="1"/><circle cx="17.5" cy="10" r="2"/></svg>
                <span>Inventario</span><span class="admin-nav-indicator"></span>
            </a>
            <a href="admin/administradores"<?= $section === 'administrators' ? ' class="active" aria-current="page"' : '' ?>>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.5 3.5 0 0 1 0 6.7m2 2.2a5.8 5.8 0 0 1 3.2 5.2"/></svg>
                <span>Administradores</span><span class="admin-nav-indicator"></span>
            </a>
            <span class="admin-nav-group-label">CANALES DE VENTA</span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="WhatsApp, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19l1.2-4.1A7.5 7.5 0 1 1 20 11.5Z"/><path d="M9 9c.5 2 2 3.5 4 4"/></svg><span>WhatsApp</span>
            </span>
            <a href="tienda" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10v10h18V10M2 4h20l-1.5 6H3.5L2 4Z"/><path d="M9 20v-6h6v6"/></svg><span>Catálogo en línea</span><span class="admin-nav-indicator"></span>
            </a>
            <span class="admin-nav-group-label">OTROS</span>
            <a href="admin/tienda.html">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
                <span>Panel local de tienda</span><span class="admin-nav-indicator"></span>
            </a>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Novedades, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14V8h4l9-4v14l-9-4H4Zm4 0 2 6h4l-2-5"/></svg><span>Novedades</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Contactar a Soporte, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 13v-2a8 8 0 0 1 16 0v2m-16 0v4h4v-6H4Zm16 0v4h-4v-6h4Zm-4 6a4 4 0 0 1-4 3h-1"/></svg><span>Contactar a Soporte</span>
            </span>
            <span class="admin-nav-item is-unavailable" aria-disabled="true" aria-label="Preferencias, próximamente" title="Sección próximamente">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z"/></svg><span>Preferencias</span>
            </span>
        </nav>
        <div class="admin-sidebar-spacer"></div>
        <div class="admin-profile">
            <span class="admin-avatar" data-admin-initial>A</span>
            <span class="admin-profile-copy"><strong data-admin-name>Administrador</strong><small>Administrador</small></span>
            <form action="logout" method="post">
                <button type="submit" class="admin-logout" aria-label="Cerrar sesión" title="Cerrar sesión">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5m5-4 4-4-4-4m4 4H9"/></svg>
                </button>
            </form>
        </div>
    </aside>
