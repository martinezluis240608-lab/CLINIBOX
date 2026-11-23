(() => {
    const page = document.body.dataset.adminPage;
    const localStorePages = {
        summary: 'home',
        products: 'products',
        inventory: 'inventory',
    };
    if (localStorePages[page]) {
        window.location.replace(new URL(`admin/tienda.html#${localStorePages[page]}`, document.baseURI).href);
        return;
    }

    const apiUrl = (resource, params = {}) => {
        const url = new URL(`admin/api/${resource}`, document.baseURI);
        for (const [key, value] of Object.entries(params)) {
            if (value !== '') url.searchParams.set(key, value);
        }
        return url;
    };

    const setText = (selector, value) => {
        for (const element of document.querySelectorAll(selector)) {
            element.textContent = String(value);
        }
    };

    const element = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text !== undefined && text !== null) node.textContent = String(text);
        if (className) node.className = className;
        return node;
    };

    const cell = (text, className) => {
        const node = element('td');
        node.append(element('span', text, className));
        return node;
    };

    const showFeedback = (message, type = 'error') => {
        const banner = document.querySelector('[data-feedback], [data-dashboard-error]');
        if (!banner || !message) return;
        banner.hidden = false;
        banner.className = `admin-alert alert-${type}`;
        banner.textContent = message;
    };

    const applyChrome = (data) => {
        // Forms in static HTML receive their CSRF token from the authenticated data response.
        for (const input of document.querySelectorAll('[data-csrf-token]')) {
            input.value = data.csrfToken;
        }
        if (data.adminName) {
            setText('[data-admin-name]', data.adminName);
            const initial = data.adminName.trim().charAt(0).toUpperCase() || 'A';
            setText('[data-admin-initial]', initial);
        }
        setText('[data-current-date]', new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date()));
        if (data.success) showFeedback(data.success, 'success');
        if (data.error) showFeedback(data.error);
    };

    const fetchData = async (resource, params) => {
        const response = await fetch(apiUrl(resource, params), {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });
        if (!response.ok) throw new Error(`No se pudieron cargar los datos (HTTP ${response.status}).`);
        return response.json();
    };

    const renderEmptyRow = (tbody, columns, title, description) => {
        const row = element('tr');
        const td = element('td');
        td.colSpan = columns;
        const empty = element('div', undefined, 'admin-empty-inline');
        empty.append(element('strong', title), element('span', description));
        td.append(empty);
        row.append(td);
        tbody.replaceChildren(row);
    };

    const renderDashboard = async () => {
        const emptyState = document.querySelector('[data-low-stock-empty]');
        const table = document.querySelector('[data-low-stock-table]');
        const rows = document.querySelector('[data-low-stock-rows]');
        try {
            const summary = await fetchData('resumen');
            applyChrome(summary);
            setText('[data-stat="product_count"]', summary.stats.product_count);
            setText('[data-stat="stock_units"]', summary.stats.stock_units);
            setText('[data-stat="low_stock_count"]', summary.stats.low_stock_count);
            setText('[data-low-stock-caption]', Number(summary.stats.low_stock_count) > 0 ? 'Requieren revisión' : 'Todo abastecido');

            if (summary.lowStock.length === 0) {
                emptyState.hidden = false;
                emptyState.querySelector('strong').textContent = 'Todo está en orden';
                emptyState.querySelector('p').textContent = 'No hay productos activos bajo el mínimo configurado.';
                table.hidden = true;
                return;
            }

            rows.replaceChildren();
            for (const product of summary.lowStock) {
                const row = element('tr');
                row.append(cell(product.nombre, 'admin-product-name'));
                row.append(cell(product.sku, 'admin-code'));
                row.append(cell(`${product.stock} uds.`, 'stock-critical'));
                row.append(cell(`${product.stock_minimo} uds.`));
                const badgeCell = element('td');
                const badge = element('span', undefined, 'admin-badge badge-warning');
                badge.append(element('i'), document.createTextNode('Reabastecer'));
                badgeCell.append(badge);
                row.append(badgeCell);
                const actionCell = element('td');
                const action = element('a', 'Ajustar', 'admin-row-link');
                action.href = new URL('admin/inventario', document.baseURI).href;
                actionCell.append(action);
                row.append(actionCell);
                rows.append(row);
            }
            emptyState.hidden = true;
            table.hidden = false;
        } catch (error) {
            emptyState.hidden = false;
            emptyState.querySelector('strong').textContent = 'No se pudo cargar el inventario';
            emptyState.querySelector('p').textContent = 'Recarga la página o verifica tu conexión y acceso.';
            showFeedback(error.message);
        }
    };

    const renderProducts = async () => {
        const rows = document.querySelector('[data-product-rows]');
        const search = new URLSearchParams(window.location.search).get('buscar') || '';
        const searchField = document.querySelector('[name="buscar"]');
        searchField.value = search;

        try {
            const data = await fetchData('productos', {
                buscar: search,
                editar: new URLSearchParams(window.location.search).get('editar') || '',
            });
            applyChrome(data);
            setText('[data-product-count]', data.products.length);
            if (data.products.length === 0) {
                renderEmptyRow(rows, 7, 'No encontramos productos', 'Prueba con otro término o registra un nuevo producto.');
            } else {
                rows.replaceChildren();
                for (const product of data.products) {
                    const row = element('tr');
                    const nameCell = element('td');
                    const productCell = element('span', undefined, 'admin-product-cell');
                    productCell.append(element('span', product.nombre.charAt(0).toUpperCase(), 'admin-product-thumbnail'));
                    productCell.append(element('strong', product.nombre, 'admin-product-name'));
                    nameCell.append(productCell);
                    row.append(nameCell, cell(product.sku, 'admin-code'), cell(product.categoria));
                    row.append(cell(`$${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'admin-price'));
                    row.append(cell(`${product.stock} uds.`, Number(product.stock) <= Number(product.stock_minimo) ? 'admin-stock-value stock-critical' : 'admin-stock-value'));
                    const statusCell = element('td');
                    const active = Number(product.activo) === 1;
                    const badge = element('span', undefined, `admin-badge ${active ? 'badge-success' : 'badge-neutral'}`);
                    badge.append(element('i'), document.createTextNode(active ? 'Activo' : 'Inactivo'));
                    statusCell.append(badge);
                    row.append(statusCell);
                    const editCell = element('td');
                    const edit = element('a', 'Editar', 'admin-row-link');
                    const editUrl = new URL('admin/productos', document.baseURI);
                    editUrl.searchParams.set('editar', product.id);
                    edit.href = editUrl.href;
                    edit.setAttribute('aria-label', `Editar ${product.nombre}`);
                    editCell.append(edit);
                    row.append(editCell);
                    rows.append(row);
                }
            }

            const editing = data.editing;
            if (editing) {
                const form = document.querySelector('#product-form form');
                for (const field of ['id', 'nombre', 'sku', 'categoria', 'precio', 'stock_minimo', 'descripcion']) {
                    form.elements.namedItem(field).value = editing[field] ?? '';
                }
                form.elements.namedItem('activo').checked = Number(editing.activo) === 1;
                document.querySelector('[data-initial-stock-field]').hidden = true;
                form.elements.namedItem('stock_inicial').disabled = true;
                document.querySelector('[data-product-kicker]').textContent = 'ACTUALIZACIÓN DEL CATÁLOGO';
                document.querySelector('[data-product-form-title]').textContent = 'Editar producto';
                document.querySelector('[data-cancel-edit]').hidden = false;
                form.querySelector('button[type="submit"]').firstChild.textContent = 'Guardar cambios ';
            }
        } catch (error) {
            renderEmptyRow(rows, 7, 'No se pudo cargar el catálogo', 'Recarga la página o verifica tu conexión y acceso.');
            showFeedback(error.message);
        }
    };

    const formField = (labelText, control) => {
        const label = element('label', undefined, 'admin-field');
        label.append(element('span', labelText), control);
        return label;
    };

    const renderInventory = async () => {
        const productsBody = document.querySelector('[data-inventory-rows]');
        const movementsBody = document.querySelector('[data-movement-rows]');
        try {
            const data = await fetchData('inventario');
            applyChrome(data);
            for (const [key, value] of Object.entries(data.stats)) setText(`[data-inventory-stat="${key}"]`, value);
            setText('[data-product-count]', data.products.length);

            if (data.products.length === 0) {
                renderEmptyRow(productsBody, 5, 'Tu inventario está vacío', 'Agrega productos al catálogo para empezar a registrar existencias.');
            } else {
                productsBody.replaceChildren();
                for (const product of data.products) {
                    const row = element('tr');
                    const nameCell = element('td');
                    const productCell = element('span', undefined, 'admin-product-cell');
                    productCell.append(element('span', product.nombre.charAt(0).toUpperCase(), 'admin-product-thumbnail'));
                    const name = element('span');
                    name.append(element('strong', product.nombre, 'admin-product-name'));
                    if (Number(product.activo) !== 1) name.append(element('small', 'Producto inactivo', 'admin-inactive-label'));
                    productCell.append(name);
                    nameCell.append(productCell);
                    row.append(nameCell, cell(product.sku, 'admin-code'));
                    row.append(cell(`${product.stock} uds.`, Number(product.stock) <= Number(product.stock_minimo) ? 'admin-stock-value stock-critical' : 'admin-stock-value'));
                    row.append(cell(`${product.stock_minimo} uds.`));

                    const movementCell = element('td', undefined, 'admin-movement-cell');
                    const details = element('details', undefined, 'admin-movement-details');
                    details.append(element('summary', '+ Registrar movimiento'));
                    const form = element('form', undefined, 'inventory-movement-form');
                    form.method = 'post';
                    form.action = new URL('admin/inventario/ajustar', document.baseURI).href;
                    const csrf = element('input');
                    csrf.type = 'hidden';
                    csrf.name = 'csrf_token';
                    csrf.value = data.csrfToken;
                    const productId = element('input');
                    productId.type = 'hidden';
                    productId.name = 'producto_id';
                    productId.value = product.id;
                    form.append(csrf, productId);

                    const type = element('select');
                    type.name = 'tipo';
                    for (const [value, label] of [['entrada', 'Entrada (+)'], ['salida', 'Salida (-)'], ['ajuste', 'Conteo físico (=)']]) {
                        const option = element('option', label);
                        option.value = value;
                        type.append(option);
                    }
                    const quantity = element('input');
                    quantity.type = 'number';
                    quantity.name = 'cantidad';
                    quantity.min = '0';
                    quantity.step = '1';
                    quantity.value = '1';
                    quantity.required = true;
                    const reason = element('input');
                    reason.type = 'text';
                    reason.name = 'motivo';
                    reason.maxLength = 255;
                    reason.placeholder = 'Ej. Reposición de mercancía';
                    reason.required = true;
                    form.append(
                        formField('Tipo', type),
                        formField('Cantidad', quantity),
                        formField('Motivo', reason),
                    );
                    form.append(element('button', 'Confirmar', 'admin-button'));
                    details.append(form);
                    movementCell.append(details);
                    row.append(movementCell);
                    productsBody.append(row);
                }
            }

            if (data.movements.length === 0) {
                renderEmptyRow(movementsBody, 6, 'Aún no hay movimientos', 'Los cambios de existencias aparecerán aquí.');
            } else {
                movementsBody.replaceChildren();
                for (const movement of data.movements) {
                    const row = element('tr');
                    const typeCell = element('td');
                    const typeClass = movement.tipo === 'entrada' ? 'badge-success' : (movement.tipo === 'salida' ? 'badge-warning' : 'badge-neutral');
                    const badge = element('span', undefined, `admin-badge ${typeClass}`);
                    badge.append(element('i'), document.createTextNode(movement.tipo.charAt(0).toUpperCase() + movement.tipo.slice(1)));
                    typeCell.append(badge);
                    row.append(typeCell, cell(movement.producto, 'admin-product-name'));
                    const amount = Number(movement.cantidad);
                    row.append(cell(amount > 0 ? `+${amount}` : amount, amount < 0 ? 'stock-critical' : 'stock-positive'));
                    row.append(cell(movement.motivo), cell(movement.usuario), cell(movement.created_at, 'admin-date'));
                    movementsBody.append(row);
                }
            }
        } catch (error) {
            renderEmptyRow(productsBody, 5, 'No se pudo cargar el inventario', 'Recarga la página o verifica tu conexión y acceso.');
            renderEmptyRow(movementsBody, 6, 'No se pudo cargar el historial', 'Recarga la página o verifica tu conexión y acceso.');
            showFeedback(error.message);
        }
    };

    const renderAdministrators = async () => {
        const rows = document.querySelector('[data-admin-rows]');
        try {
            const data = await fetchData('administradores');
            applyChrome(data);
            setText('[data-admin-count]', data.administrators.length);
            if (data.administrators.length === 0) {
                renderEmptyRow(rows, 4, 'No hay administradores activos', 'Las nuevas cuentas aparecerán aquí después de crearlas.');
                return;
            }

            rows.replaceChildren();
            for (const administrator of data.administrators) {
                const row = element('tr');
                const userCell = element('td');
                const user = element('span', undefined, 'admin-user-cell');
                user.append(element('span', administrator.nombre.charAt(0).toUpperCase(), 'admin-avatar admin-avatar-table'));
                user.append(element('strong', administrator.nombre));
                userCell.append(user);
                row.append(userCell, cell(administrator.email), cell(administrator.created_at, 'admin-date'));
                const status = element('td');
                const badge = element('span', undefined, 'admin-badge badge-success');
                badge.append(element('i'), document.createTextNode('Activo'));
                status.append(badge);
                row.append(status);
                rows.append(row);
            }
        } catch (error) {
            renderEmptyRow(rows, 4, 'No se pudieron cargar las cuentas', 'Recarga la página o verifica tu conexión y acceso.');
            showFeedback(error.message);
        }
    };

    const renderSetup = async () => {
        try {
            const data = await fetchData('configurar');
            applyChrome(data);
        } catch (error) {
            showFeedback(error.message);
        }
    };

    if (page === 'summary') renderDashboard();
    if (page === 'products') renderProducts();
    if (page === 'inventory') renderInventory();
    if (page === 'administrators') renderAdministrators();
    if (page === 'setup') renderSetup();
})();
