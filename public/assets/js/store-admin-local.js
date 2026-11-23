(() => {
    'use strict';

    const databaseName = 'cliniboxStoreLocal';
    const databaseVersion = 2;
    const root = document.querySelector('[data-module-root]');
    const nav = document.querySelector('[data-store-nav]');
    const pageTitle = document.querySelector('[data-page-breadcrumb]');
    const titles = {
        home: 'Inicio',
        products: 'Productos',
        sales: 'Ventas',
        customers: 'Clientes',
        reports: 'Reportes',
        purchases: 'Compras y Gastos',
        invoices: 'Facturación',
        employees: 'Empleados IA',
        inventory: 'Inventario',
        whatsapp: 'WhatsApp',
        news: 'Novedades',
        support: 'Contactar a Soporte',
        settings: 'Preferencias',
    };
    const sections = [
        ['TIENDA', [
            ['home', 'Inicio'],
            ['products', 'Productos'],
            ['sales', 'Ventas'],
            ['customers', 'Clientes'],
            ['reports', 'Reportes'],
            ['purchases', 'Compras y Gastos'],
            ['invoices', 'Facturación'],
            ['employees', 'Empleados IA'],
            ['inventory', 'Inventario'],
        ]],
        ['ADMINISTRACIÓN', [
            ['administrators', 'Administradores'],
        ]],
        ['CANALES DE VENTA', [
            ['whatsapp', 'WhatsApp'],
            ['catalog', 'Catálogo en línea'],
        ]],
        ['OTROS', [
            ['news', 'Novedades'],
            ['support', 'Contactar a Soporte'],
            ['settings', 'Preferencias'],
        ]],
    ];
    const navIcons = {
        home: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>',
        products: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8.5 4.7v8.6L12 21l-8.5-4.7V7.7L12 3Z"/><path d="m3.8 7.8 8.2 4.6 8.2-4.6M12 12.5V21"/></svg>',
        sales: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3Z"/><path d="M9 8h6m-6 4h6m-6 4h3"/></svg>',
        customers: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.5 3.5 0 0 1 0 6.7m2 2.2a5.8 5.8 0 0 1 3.2 5.2"/></svg>',
        reports: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg>',
        purchases: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h18v13H3zM7 7V4h10v3m-6 4v5m-2.5-2.5h5"/></svg>',
        invoices: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6m-6 4h6m-6 4h3"/></svg>',
        employees: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0m2.8-12a3.2 3.2 0 0 1 0 6.2m-1 2.1a5.3 5.3 0 0 1 4.2 3.7"/></svg>',
        administrators: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0m2.8-12a3.2 3.2 0 0 1 0 6.2m-1 2.1a5.3 5.3 0 0 1 4.2 3.7"/></svg>',
        inventory: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19.5h16M6.5 16V9m5.5 7V4m5.5 12v-4"/><circle cx="6.5" cy="7" r="2"/><circle cx="12" cy="2.8" r="1"/><circle cx="17.5" cy="10" r="2"/></svg>',
        whatsapp: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-11.2 6.5L4 19l1.2-4.1A7.5 7.5 0 1 1 20 11.5Z"/><path d="M9 9c.5 2 2 3.5 4 4"/></svg>',
        catalog: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10v10h18V10M2 4h20l-1.5 6H3.5L2 4Z"/><path d="M9 20v-6h6v6"/></svg>',
        news: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 14V8h4l9-4v14l-9-4H4Zm4 0 2 6h4l-2-5"/></svg>',
        support: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 13v-2a8 8 0 0 1 16 0v2m-16 0v4h4v-6H4Zm16 0v4h-4v-6h4Zm-4 6a4 4 0 0 1-4 3h-1"/></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.7Z"/></svg>',
    };
    const seedProducts = [
        { sku: 'CBX-001', nombre: 'Paracetamol 500 mg', categoria: 'Medicamentos', precio: 45, stock: 24, stock_minimo: 5, activo: 1 },
        { sku: 'CBX-002', nombre: 'Vitamina C 1000 mg', categoria: 'Vitaminas y suplementos', precio: 120, stock: 18, stock_minimo: 5, activo: 1 },
        { sku: 'CBX-003', nombre: 'Termómetro digital', categoria: 'Equipos médicos', precio: 85, stock: 8, stock_minimo: 3, activo: 1 },
        { sku: 'CBX-004', nombre: 'Gasas estériles', categoria: 'Primeros auxilios', precio: 60, stock: 32, stock_minimo: 4, activo: 1 },
        { sku: 'CBX-005', nombre: 'Gel antibacterial', categoria: 'Higiene personal', precio: 55, stock: 20, stock_minimo: 5, activo: 1 },
        { sku: 'CBX-006', nombre: 'Protector solar FPS 50', categoria: 'Cuidado de la piel', precio: 189, stock: 12, stock_minimo: 3, activo: 1 },
        { sku: 'CBX-007', nombre: 'Ibuprofeno 400 mg', categoria: 'Medicamentos', precio: 75, stock: 22, stock_minimo: 5, activo: 1 },
        { sku: 'CBX-008', nombre: 'Multivitamínico', categoria: 'Vitaminas y suplementos', precio: 210, stock: 15, stock_minimo: 4, activo: 1 },
        { sku: 'CBX-009', nombre: 'Tensiómetro digital', categoria: 'Equipos médicos', precio: 549, stock: 1, stock_minimo: 2, activo: 1 },
        { sku: 'CBX-010', nombre: 'Oxímetro de pulso', categoria: 'Equipos médicos', precio: 329, stock: 7, stock_minimo: 2, activo: 1 },
        { sku: 'CBX-011', nombre: 'Kit de curación', categoria: 'Primeros auxilios', precio: 149, stock: 10, stock_minimo: 4, activo: 1 },
        { sku: 'CBX-012', nombre: 'Crema hidratante', categoria: 'Cuidado de la piel', precio: 135, stock: 14, stock_minimo: 4, activo: 1 },
    ];
    const productCategories = [
        'Medicamentos',
        'Higiene personal',
        'Cuidado de la piel',
        'Vitaminas y suplementos',
        'Primeros auxilios',
        'Equipos médicos',
        'Accesorios',
    ];
    const normalizeCategory = (category) => category === 'Equipo médico' ? 'Equipos médicos' : category;
    const sellingPriceFromCost = (cost, margin) => Math.round((cost * (1 + margin / 100) + Number.EPSILON) * 100) / 100;
    const defaultSettings = {
        nombre_tienda: 'CliniBox',
        tasa_impuesto: 0,
        whatsapp_telefono: '',
        whatsapp_mensaje: 'Hola, me interesa conocer los productos de la tienda.',
    };

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character]);
    const money = (value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(value) || 0);
    const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const dateLabel = (value) => value ? new Date(value).toLocaleString('es-MX') : '—';
    const localDate = (value = new Date()) => {
        const date = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
        return date.toISOString().slice(0, 10);
    };
    const feedback = (message, isError = false) => {
        const banner = document.querySelector('[data-page-feedback]');
        banner.textContent = message;
        banner.hidden = !message;
        banner.className = `admin-alert ${isError ? 'alert-error' : 'alert-success'}`;
    };
    const requestValue = (request) => new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('No se pudo leer el almacenamiento local.'));
    });

    const databaseReady = new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            reject(new Error('Este navegador no tiene IndexedDB disponible.'));
            return;
        }
        const request = indexedDB.open(databaseName, databaseVersion);
        request.onupgradeneeded = (event) => {
            const db = request.result;
            const stores = [
                ['products', { keyPath: 'sku' }],
                ['customers', { keyPath: 'id' }],
                ['sales', { keyPath: 'id' }],
                ['movements', { keyPath: 'id' }],
                ['transactions', { keyPath: 'id' }],
                ['invoices', { keyPath: 'saleId' }],
                ['employees', { keyPath: 'id' }],
                ['announcements', { keyPath: 'id' }],
                ['tickets', { keyPath: 'id' }],
                ['settings', { keyPath: 'key' }],
            ];
            for (const [name, options] of stores) {
                if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, options);
            }

            const transaction = request.transaction;
            const products = transaction.objectStore('products');
            if (event.oldVersion === 0) {
                for (const product of seedProducts) products.put({ ...product, stock_pendiente_confirmacion: 1 });
                const settings = transaction.objectStore('settings');
                for (const [key, value] of Object.entries(defaultSettings)) settings.put({ key, value });
            } else if (event.oldVersion < 2) {
                const state = { products: null, sales: 0, movements: 0, transactions: 0, remaining: 4 };
                const migrateIfEmpty = () => {
                    if (--state.remaining !== 0 || state.sales || state.movements || state.transactions) return;
                    const existingProducts = new Map(state.products.map((product) => [product.sku, product]));
                    for (const seed of seedProducts) {
                        const existing = existingProducts.get(seed.sku);
                        if (!existing) {
                            products.put({ ...seed, stock_pendiente_confirmacion: 1 });
                        } else if (Number(existing.stock) === 0) {
                            products.put({ ...existing, stock: seed.stock, stock_pendiente_confirmacion: 1 });
                        }
                    }
                };
                const productRequest = products.getAll();
                productRequest.onsuccess = () => {
                    state.products = productRequest.result;
                    migrateIfEmpty();
                };
                for (const storeName of ['sales', 'movements', 'transactions']) {
                    const countRequest = transaction.objectStore(storeName).count();
                    countRequest.onsuccess = () => {
                        state[storeName] = countRequest.result;
                        migrateIfEmpty();
                    };
                }
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('No se pudo abrir la base local de la tienda.'));
        request.onblocked = () => reject(new Error('Cierra otras pestañas de CliniBox para actualizar la base local.'));
    });

    const getAll = async (storeName) => {
        const db = await databaseReady;
        const tx = db.transaction(storeName, 'readonly');
        return requestValue(tx.objectStore(storeName).getAll());
    };
    const putRecord = async (storeName, value) => {
        const db = await databaseReady;
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(value);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(value);
            tx.onerror = () => reject(tx.error || new Error('No se pudo guardar el registro.'));
            tx.onabort = () => reject(tx.error || new Error('Se canceló el guardado.'));
        });
    };
    const readSettings = async () => {
        const saved = await getAll('settings');
        return { ...defaultSettings, ...Object.fromEntries(saved.map((entry) => [entry.key, entry.value])) };
    };
    const saveSettings = async (values) => {
        const db = await databaseReady;
        const tx = db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        for (const [key, value] of Object.entries(values)) store.put({ key, value });
        return new Promise((resolve, reject) => {
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error || new Error('No se pudieron guardar las preferencias.'));
            tx.onabort = () => reject(tx.error || new Error('Se canceló el guardado.'));
        });
    };

    const recordSale = async (customerId, items) => {
        const db = await databaseReady;
        const settings = await readSettings();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['products', 'sales', 'movements'], 'readwrite');
            const productStore = tx.objectStore('products');
            const request = productStore.getAll();
            let failure = null;
            let sale = null;
            request.onsuccess = () => {
                try {
                    const productsBySku = new Map(request.result.map((product) => [product.sku, product]));
                    const quantities = new Map();
                    for (const item of items) quantities.set(item.sku, (quantities.get(item.sku) || 0) + item.quantity);
                    const lines = [];
                    let subtotal = 0;
                    for (const [sku, quantity] of quantities) {
                        const product = productsBySku.get(sku);
                        if (!product || !product.activo) throw new Error('Uno de los productos ya no está disponible.');
                        if (product.stock_pendiente_confirmacion) throw new Error(`Confirma la existencia real de ${product.nombre} antes de vender.`);
                        if (product.stock < quantity) throw new Error(`No hay existencias suficientes de ${product.nombre}.`);
                        const total = Math.round(Number(product.precio) * quantity * 100) / 100;
                        lines.push({ sku, nombre: product.nombre, cantidad: quantity, precio: Number(product.precio), total });
                        subtotal += total;
                        product.stock -= quantity;
                        productStore.put(product);
                        tx.objectStore('movements').add({
                            id: newId(), sku, tipo: 'salida', cantidad: -quantity,
                            motivo: 'Venta', createdAt: new Date().toISOString(),
                        });
                    }
                    const impuesto = Math.round(subtotal * Number(settings.tasa_impuesto || 0)) / 100;
                    sale = {
                        id: newId(),
                        folio: `CBX-VTA-${localDate().replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
                        clienteId: customerId || '',
                        items: lines,
                        subtotal: Math.round(subtotal * 100) / 100,
                        impuesto: Math.round(impuesto * 100) / 100,
                        total: Math.round((subtotal + impuesto) * 100) / 100,
                        estado: 'completada',
                        createdAt: new Date().toISOString(),
                    };
                    tx.objectStore('sales').add(sale);
                } catch (error) {
                    failure = error;
                    tx.abort();
                }
            };
            tx.oncomplete = () => resolve(sale);
            tx.onerror = () => reject(failure || tx.error || new Error('No se pudo registrar la venta.'));
            tx.onabort = () => reject(failure || tx.error || new Error('Se canceló la venta.'));
        });
    };

    const recordPurchaseOrExpense = async (record) => {
        const db = await databaseReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['products', 'movements', 'transactions'], 'readwrite');
            let failure = null;
            const save = (product = null) => {
                if (record.tipo === 'compra') {
                    if (!product) {
                        failure = new Error('Selecciona un producto válido.');
                        tx.abort();
                        return;
                    }
                    product.stock += record.cantidad;
                    tx.objectStore('products').put(product);
                    tx.objectStore('movements').add({
                        id: newId(), sku: product.sku, tipo: 'entrada', cantidad: record.cantidad,
                        motivo: `Compra: ${record.descripcion}`, createdAt: record.createdAt,
                    });
                    record.producto = product.nombre;
                    record.total = Math.round(record.cantidad * record.importe * 100) / 100;
                } else {
                    record.total = record.importe;
                }
                tx.objectStore('transactions').add(record);
            };
            if (record.tipo === 'compra') {
                const request = tx.objectStore('products').get(record.sku);
                request.onsuccess = () => save(request.result);
                request.onerror = () => {
                    failure = request.error;
                    tx.abort();
                };
            } else {
                save();
            }
            tx.oncomplete = () => resolve(record);
            tx.onerror = () => reject(failure || tx.error || new Error('No se pudo guardar el registro.'));
            tx.onabort = () => reject(failure || tx.error || new Error('Se canceló el registro.'));
        });
    };

    const adjustProductStock = async (sku, quantity, type, reason) => {
        const db = await databaseReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['products', 'movements'], 'readwrite');
            let failure = null;
            const request = tx.objectStore('products').get(sku);
            request.onsuccess = () => {
                const product = request.result;
                if (!product) {
                    failure = new Error('El producto seleccionado no existe.');
                    tx.abort();
                    return;
                }
                const nextStock = type === 'salida' ? product.stock - quantity : type === 'ajuste' ? quantity : product.stock + quantity;
                if (nextStock < 0) {
                    failure = new Error('La salida no puede ser mayor que las existencias.');
                    tx.abort();
                    return;
                }
                const delta = nextStock - product.stock;
                product.stock = nextStock;
                if (type === 'ajuste') product.stock_pendiente_confirmacion = 0;
                tx.objectStore('products').put(product);
                tx.objectStore('movements').add({
                    id: newId(), sku, tipo: type, cantidad: delta, motivo: reason, createdAt: new Date().toISOString(),
                });
            };
            request.onerror = () => {
                failure = request.error;
                tx.abort();
            };
            tx.oncomplete = resolve;
            tx.onerror = () => reject(failure || tx.error || new Error('No se pudo actualizar el inventario.'));
            tx.onabort = () => reject(failure || tx.error || new Error('Se canceló el movimiento.'));
        });
    };

    const saveProductWithStock = async (product, quantityToAdd, isEditing) => {
        const db = await databaseReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(['products', 'movements'], 'readwrite');
            let failure = null;
            const products = tx.objectStore('products');
            const request = products.get(product.sku);
            request.onsuccess = () => {
                const current = request.result;
                if (isEditing && !current) {
                    failure = new Error('El producto ya no existe en el catálogo.');
                    tx.abort();
                    return;
                }
                if (!isEditing && current) {
                    failure = new Error('Ese SKU ya está registrado.');
                    tx.abort();
                    return;
                }
                const nextStock = (isEditing ? Number(current.stock) : 0) + quantityToAdd;
                if (!Number.isSafeInteger(nextStock)) {
                    failure = new Error('La cantidad de existencias es demasiado grande.');
                    tx.abort();
                    return;
                }
                products.put({
                    ...product,
                    stock: nextStock,
                    stock_pendiente_confirmacion: isEditing ? (current.stock_pendiente_confirmacion || 0) : 0,
                });
                if (quantityToAdd > 0) {
                    tx.objectStore('movements').add({
                        id: newId(),
                        sku: product.sku,
                        tipo: 'entrada',
                        cantidad: quantityToAdd,
                        motivo: isEditing ? 'Entrada agregada desde Productos' : 'Existencia inicial capturada al crear el producto',
                        createdAt: new Date().toISOString(),
                    });
                }
            };
            request.onerror = () => {
                failure = request.error;
                tx.abort();
            };
            tx.oncomplete = resolve;
            tx.onerror = () => reject(failure || tx.error || new Error('No se pudo guardar el producto y sus existencias.'));
            tx.onabort = () => reject(failure || tx.error || new Error('Se canceló el guardado del producto.'));
        });
    };

    const loadNav = (activePage) => {
        nav.innerHTML = sections.map(([caption, items]) => `
            <div class="admin-local-nav-group">
                <span class="admin-local-nav-caption">${caption}</span>
                ${items.map(([page, label]) => page === 'catalog'
                    ? `<a href="/CLINIBOX/CLINIBOX/app/views/tienda/tienda.html" target="_blank" rel="noopener"><span class="admin-local-icon">${navIcons[page]}</span><span>${label}</span></a>`
                    : page === 'administrators'
                        ? `<a href="/CLINIBOX/CLINIBOX/public/admin/administradores"><span class="admin-local-icon">${navIcons[page]}</span><span>${label}</span></a>`
                    : `<a class="${page === activePage ? 'active' : ''}" href="#${page}" ${page === activePage ? 'aria-current="page"' : ''}><span class="admin-local-icon">${navIcons[page]}</span><span>${label}</span><span class="admin-nav-indicator"></span></a>`
                ).join('')}
            </div>
        `).join('');
    };

    const setPageHeader = (page) => {
        pageTitle.textContent = titles[page] || titles.home;
        document.title = `${pageTitle.textContent} | CliniBox`;
        document.querySelector('[data-current-date]').textContent = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date());
    };
    const makeEmptyRow = (columns, title, description) => `<tr><td colspan="${columns}"><div class="admin-empty-inline"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(description)}</span></div></td></tr>`;
    const productOptions = (products, placeholder = 'Seleccionar producto') => `<option value="">${placeholder}</option>${products.map((product) => `<option value="${escapeHtml(product.sku)}">${escapeHtml(product.nombre)} · ${money(product.precio)} · ${product.stock} en stock</option>`).join('')}`;
    const customerOptions = (customers) => `<option value="">Venta de mostrador</option>${customers.map((customer) => `<option value="${escapeHtml(customer.id)}">${escapeHtml(customer.nombre)}</option>`).join('')}`;

    const renderHome = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">MÓDULO DE TIENDA</p><h1>Panel de control</h1><p class="admin-page-description">Consulta las ventas, existencias y actividad de tu tienda.</p></div></header>
            <section class="admin-stats admin-local-stats">
                <article class="admin-stat-card"><span class="admin-stat-icon icon-teal">P</span><span class="admin-stat-label">Productos activos</span><strong data-home-products>0</strong><small>En el catálogo local</small></article>
                <article class="admin-stat-card"><span class="admin-stat-icon icon-blue">U</span><span class="admin-stat-label">Unidades en stock</span><strong data-home-units>0</strong><small>En el inventario local</small></article>
                <article class="admin-stat-card"><span class="admin-stat-icon icon-amber">!</span><span class="admin-stat-label">Stock bajo</span><strong data-home-low>0</strong><small>Productos por revisar</small></article>
                <article class="admin-stat-card"><span class="admin-stat-icon icon-purple">✓</span><span class="admin-stat-label">Existencias por confirmar</span><strong data-home-unverified>0</strong><small>Revisa el conteo físico</small></article>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">ACCESOS RÁPIDOS</span><h2>Operación de tienda</h2><p>Elige una sección para continuar.</p></div></div>
                <div class="admin-local-quick-links">
                    <a href="#sales">Nueva venta <span>→</span></a><a href="#products">Agregar producto <span>→</span></a>
                    <a href="#purchases">Registrar compra o gasto <span>→</span></a><a href="#reports">Ver reportes <span>→</span></a>
                </div>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">ACTIVIDAD</span><h2>Ventas recientes</h2></div></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Folio</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr></thead><tbody data-home-recent></tbody></table></div>
            </section>
            <p class="admin-local-notice" data-home-data-note></p><p class="admin-local-notice">Los datos de esta versión se guardan en IndexedDB de este navegador. No se sincronizan con otros dispositivos.</p>`;
        try {
            const [products, sales, customers] = await Promise.all([
                getAll('products'), getAll('sales'), getAll('customers'),
            ]);
            const lowStock = products.filter((product) => product.activo && product.stock <= product.stock_minimo);
            const unverifiedStock = products.filter((product) => product.stock_pendiente_confirmacion).length;
            root.querySelector('[data-home-products]').textContent = products.filter((product) => product.activo).length;
            root.querySelector('[data-home-units]').textContent = products.reduce((sum, product) => sum + Number(product.stock), 0);
            root.querySelector('[data-home-low]').textContent = lowStock.length;
            root.querySelector('[data-home-unverified]').textContent = unverifiedStock;
            root.querySelector('[data-home-data-note]').textContent = unverifiedStock
                ? `Las existencias iniciales son sugeridas: confirma el conteo físico de ${unverifiedStock} productos en Inventario. No hay ventas ni historial de muestra.`
                : 'No hay ventas ni historial de muestra; las cifras aparecerán al registrar operaciones reales.';
            const recent = sales.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
            const customerMap = new Map(customers.map((customer) => [customer.id, customer.nombre]));
            root.querySelector('[data-home-recent]').innerHTML = recent.length
                ? recent.map((sale) => `<tr><td>${escapeHtml(sale.folio)}</td><td>${escapeHtml(customerMap.get(sale.clienteId) || 'Mostrador')}</td><td>${escapeHtml(dateLabel(sale.createdAt))}</td><td>${money(sale.total)}</td></tr>`).join('')
                : makeEmptyRow(4, 'Todavía no hay ventas', 'Las ventas registradas aparecerán aquí.');
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderProducts = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Catálogo</p><h1>Productos</h1><p class="admin-page-description">Administra productos, precios y niveles de existencias locales.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">CATÁLOGO LOCAL</span><h2 data-product-form-title>Agregar producto</h2><p>El SKU identifica cada producto dentro de esta tienda.</p></div></div>
                <form class="admin-form-grid" data-product-form>
                    <label class="admin-field"><span>Nombre <i>*</i></span><input name="nombre" maxlength="160" required></label>
                    <label class="admin-field"><span>SKU <i>*</i></span><input name="sku" maxlength="60" required></label>
                    <label class="admin-field"><span>Categoría <i>*</i></span><select name="categoria" required><option value="" selected disabled>Selecciona una categoría</option>${productCategories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('')}</select></label>
                    <label class="admin-field"><span>Precio de compra (MXN)</span><input name="precio_compra" type="number" min="0" step="0.01"></label>
                    <label class="admin-field"><span>Margen de ganancia (%)</span><input name="margen_ganancia" type="number" min="0" step="0.01"></label>
                    <label class="admin-field"><span>Precio de venta calculado (MXN)</span><input name="precio" type="number" min="0" step="0.01" readonly required></label>
                    <p class="admin-local-notice admin-field-wide">El precio de venta se calcula sobre el costo: compra × (1 + margen / 100).</p>
                    <label class="admin-field"><span>Existencia actual</span><input name="stock_actual" type="number" value="0" readonly><small data-stock-status hidden></small></label>
                    <label class="admin-field"><span>Cantidad nueva para agregar <i>*</i></span><input name="cantidad_agregar" type="number" min="0" step="1" value="0" required><small>Se sumará a la existencia actual.</small></label>
                    <label class="admin-field"><span>Stock mínimo</span><input name="stock_minimo" type="number" min="0" step="1" value="5" required></label>
                    <div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar producto</button><button class="admin-button admin-button-light" type="button" data-product-cancel hidden>Cancelar edición</button></div>
                </form>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading admin-catalog-heading"><div><span class="admin-section-kicker">INVENTARIO</span><h2>Productos registrados</h2></div><label class="admin-search-input"><span class="sr-only">Buscar producto</span><input type="search" data-product-search placeholder="Buscar por nombre, SKU o categoría"></label></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th></th></tr></thead><tbody data-product-rows></tbody></table></div>
            </section>`;
        try {
            const products = await getAll('products');
            const rows = root.querySelector('[data-product-rows]');
            const search = root.querySelector('[data-product-search]');
            const form = root.querySelector('[data-product-form]');
            const purchasePriceInput = form.elements.namedItem('precio_compra');
            const marginInput = form.elements.namedItem('margen_ganancia');
            const sellingPriceInput = form.elements.namedItem('precio');
            const refreshCalculatedPrice = () => {
                const costValue = purchasePriceInput.value;
                const marginValue = marginInput.value;
                const existing = products.find((product) => product.sku === form.dataset.editSku);
                if (costValue === '' && marginValue === '') {
                    sellingPriceInput.value = existing ? Number(existing.precio).toFixed(2) : '';
                    return;
                }
                const cost = Number(costValue);
                const margin = Number(marginValue);
                sellingPriceInput.value = costValue !== '' && marginValue !== ''
                    && Number.isFinite(cost) && cost >= 0
                    && Number.isFinite(margin) && margin >= 0
                    ? sellingPriceFromCost(cost, margin).toFixed(2)
                    : '';
            };
            purchasePriceInput.addEventListener('input', refreshCalculatedPrice);
            marginInput.addEventListener('input', refreshCalculatedPrice);
            const draw = () => {
                const term = search.value.trim().toLocaleLowerCase('es-MX');
                const visible = products.filter((product) => [product.nombre, product.sku, normalizeCategory(product.categoria)].some((value) => value.toLocaleLowerCase('es-MX').includes(term)));
                rows.innerHTML = visible.length ? visible.map((product) => `<tr>
                    <td class="admin-product-name">${escapeHtml(product.nombre)}</td><td><span class="admin-code">${escapeHtml(product.sku)}</span></td>
                    <td>${escapeHtml(normalizeCategory(product.categoria))}</td><td>${money(product.precio)}</td><td>${product.stock} uds.${product.stock_pendiente_confirmacion ? '<small class="admin-stock-unverified">Por confirmar</small>' : ''}</td>
                    <td><span class="admin-badge ${product.activo ? 'badge-success' : 'badge-neutral'}">${product.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td class="admin-local-actions"><button class="admin-row-link" type="button" data-edit-sku="${escapeHtml(product.sku)}">Editar</button><button class="admin-row-link" type="button" data-toggle-sku="${escapeHtml(product.sku)}">${product.activo ? 'Desactivar' : 'Activar'}</button></td></tr>`).join('')
                    : makeEmptyRow(7, 'No hay productos que mostrar', 'Cambia la búsqueda o registra un producto.');
                for (const button of rows.querySelectorAll('[data-edit-sku]')) button.addEventListener('click', () => editProduct(products.find((product) => product.sku === button.dataset.editSku)));
                for (const button of rows.querySelectorAll('[data-toggle-sku]')) button.addEventListener('click', async () => {
                    const product = products.find((entry) => entry.sku === button.dataset.toggleSku);
                    product.activo = product.activo ? 0 : 1;
                    await putRecord('products', product);
                    await renderProducts();
                });
            };
            search.addEventListener('input', draw);
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(form);
                const sku = String(values.get('sku')).trim().toUpperCase();
                const existing = products.find((product) => product.sku === form.dataset.editSku);
                if (!existing && products.some((product) => product.sku === sku)) {
                    feedback('Ese SKU ya está registrado.', true);
                    return;
                }
                const nombre = String(values.get('nombre')).trim();
                const categoria = String(values.get('categoria'));
                const costValue = String(values.get('precio_compra')).trim();
                const marginValue = String(values.get('margen_ganancia')).trim();
                const hasCost = costValue !== '';
                const hasMargin = marginValue !== '';
                if (hasCost !== hasMargin) {
                    feedback('Ingresa tanto el precio de compra como el margen para calcular el precio de venta.', true);
                    return;
                }
                if (!existing && !hasCost) {
                    feedback('Ingresa el precio de compra y el margen de ganancia.', true);
                    return;
                }
                const purchasePrice = hasCost ? Number(costValue) : (existing && existing.precio_compra != null ? Number(existing.precio_compra) : null);
                const margin = hasMargin ? Number(marginValue) : (existing && existing.margen_ganancia != null ? Number(existing.margen_ganancia) : null);
                if (hasCost && (!Number.isFinite(purchasePrice) || purchasePrice < 0 || !Number.isFinite(margin) || margin < 0)) {
                    feedback('El precio de compra y el margen deben ser números válidos mayores o iguales a cero.', true);
                    return;
                }
                const sellingPrice = hasCost ? sellingPriceFromCost(purchasePrice, margin) : Number(existing.precio);
                const quantityToAdd = Number(values.get('cantidad_agregar'));
                const minimumStock = Number(values.get('stock_minimo'));
                if (!nombre || (!productCategories.includes(categoria) && (!existing || categoria !== existing.categoria)) || !sku) {
                    feedback('Completa el nombre, SKU y una categoría válida.', true);
                    return;
                }
                if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
                    feedback('No se pudo calcular un precio de venta válido.', true);
                    return;
                }
                if (!Number.isSafeInteger(quantityToAdd) || quantityToAdd < 0 || !Number.isSafeInteger(minimumStock) || minimumStock < 0) {
                    feedback('Las cantidades de existencias deben ser números enteros iguales o mayores a cero.', true);
                    return;
                }
                const product = {
                    ...(existing || {}),
                    sku,
                    nombre,
                    categoria,
                    precio_compra: purchasePrice,
                    margen_ganancia: margin,
                    precio: sellingPrice,
                    stock: existing ? existing.stock : quantityToAdd,
                    stock_minimo: minimumStock,
                    stock_pendiente_confirmacion: existing ? (existing.stock_pendiente_confirmacion || 0) : 0,
                    activo: existing ? existing.activo : 1,
                };
                try {
                    await saveProductWithStock(product, quantityToAdd, Boolean(existing));
                    let successMessage = 'Producto agregado al catálogo local.';
                    if (existing) successMessage = quantityToAdd > 0 ? 'Producto actualizado y existencias agregadas.' : 'Producto actualizado.';
                    feedback(successMessage);
                    await renderProducts();
                } catch (error) {
                    feedback(error.message, true);
                }
            });
            root.querySelector('[data-product-cancel]').addEventListener('click', () => renderProducts());
            const editProduct = (product) => {
                if (!product) return;
                form.dataset.editSku = product.sku;
                for (const key of ['nombre', 'sku', 'stock_minimo']) form.elements.namedItem(key).value = product[key];
                const categoryInput = form.elements.namedItem('categoria');
                const category = normalizeCategory(product.categoria);
                if (!productCategories.includes(category)) {
                    const legacyOption = document.createElement('option');
                    legacyOption.value = product.categoria;
                    legacyOption.textContent = product.categoria;
                    categoryInput.add(legacyOption);
                }
                categoryInput.value = category;
                purchasePriceInput.value = product.precio_compra == null ? '' : product.precio_compra;
                marginInput.value = product.margen_ganancia == null ? '' : product.margen_ganancia;
                purchasePriceInput.required = product.precio_compra != null || product.margen_ganancia != null;
                marginInput.required = purchasePriceInput.required;
                form.elements.namedItem('stock_actual').value = product.stock;
                form.elements.namedItem('cantidad_agregar').value = '0';
                const stockStatus = form.querySelector('[data-stock-status]');
                stockStatus.hidden = !product.stock_pendiente_confirmacion;
                stockStatus.textContent = product.stock_pendiente_confirmacion ? 'Existencia sugerida: confirma el conteo físico en Inventario.' : '';
                refreshCalculatedPrice();
                form.elements.namedItem('sku').readOnly = true;
                root.querySelector('[data-product-form-title]').textContent = 'Editar producto';
                root.querySelector('[data-product-cancel]').hidden = false;
                form.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            draw();
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderCustomers = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Directorio</p><h1>Clientes</h1><p class="admin-page-description">Registra contactos y asígnalos a sus ventas.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVO REGISTRO</span><h2>Agregar cliente</h2></div></div>
                <form class="admin-form-grid" data-customer-form>
                    <label class="admin-field"><span>Nombre <i>*</i></span><input name="nombre" maxlength="160" required></label>
                    <label class="admin-field"><span>Correo</span><input name="email" type="email" maxlength="160"></label>
                    <label class="admin-field"><span>Teléfono</span><input name="telefono" type="tel" maxlength="40"></label>
                    <label class="admin-field"><span>Dirección</span><input name="direccion" maxlength="255"></label>
                    <label class="admin-field admin-field-wide"><span>Notas</span><textarea name="notas" rows="2" maxlength="1000"></textarea></label>
                    <div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar cliente</button></div>
                </form>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading admin-catalog-heading"><div><span class="admin-section-kicker">DIRECTORIO</span><h2>Clientes registrados</h2></div><label class="admin-search-input"><span class="sr-only">Buscar cliente</span><input type="search" data-customer-search placeholder="Buscar cliente"></label></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Dirección</th><th>Alta</th></tr></thead><tbody data-customer-rows></tbody></table></div>
            </section>`;
        try {
            const [customers] = await Promise.all([getAll('customers')]);
            const rows = root.querySelector('[data-customer-rows]');
            const search = root.querySelector('[data-customer-search]');
            const draw = () => {
                const term = search.value.trim().toLocaleLowerCase('es-MX');
                const found = customers.filter((customer) => [customer.nombre, customer.email, customer.telefono].some((value) => String(value || '').toLocaleLowerCase('es-MX').includes(term)));
                rows.innerHTML = found.length ? found.map((customer) => `<tr><td class="admin-product-name">${escapeHtml(customer.nombre)}</td><td>${escapeHtml(customer.email || '—')}</td><td>${escapeHtml(customer.telefono || '—')}</td><td>${escapeHtml(customer.direccion || '—')}</td><td>${escapeHtml(dateLabel(customer.createdAt))}</td></tr>`).join('') : makeEmptyRow(5, 'No hay clientes que mostrar', 'Registra un cliente o cambia la búsqueda.');
            };
            search.addEventListener('input', draw);
            root.querySelector('[data-customer-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                await putRecord('customers', {
                    id: newId(), nombre: String(values.get('nombre')).trim(), email: String(values.get('email')).trim(),
                    telefono: String(values.get('telefono')).trim(), direccion: String(values.get('direccion')).trim(),
                    notas: String(values.get('notas')).trim(), createdAt: new Date().toISOString(),
                });
                feedback('Cliente guardado en este navegador.');
                await renderCustomers();
            });
            draw();
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderSales = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Punto de venta</p><h1>Ventas</h1><p class="admin-page-description">Confirma una venta para descontar las existencias en la base local.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVA OPERACIÓN</span><h2>Registrar venta</h2></div></div>
                <form class="admin-form-grid" data-sale-form>
                    <label class="admin-field"><span>Cliente</span><select name="cliente_id" data-sale-customer></select></label>
                    <div class="admin-field admin-field-wide"><span>Productos <i>*</i></span><div class="sale-lines" data-sale-lines></div><button class="admin-button admin-button-light" type="button" data-add-sale-line>Agregar producto</button></div>
                    <div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Confirmar venta</button></div>
                </form>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL</span><h2>Ventas recientes</h2></div></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Folio</th><th>Cliente</th><th>Fecha</th><th>Total</th><th></th></tr></thead><tbody data-sales-rows></tbody></table></div>
            </section>`;
        try {
            const [products, customers, sales, invoices] = await Promise.all([getAll('products'), getAll('customers'), getAll('sales'), getAll('invoices')]);
            const customerMap = new Map(customers.map((customer) => [customer.id, customer.nombre]));
            const invoiceSet = new Set(invoices.map((invoice) => invoice.saleId));
            const customerSelect = root.querySelector('[data-sale-customer]');
            customerSelect.innerHTML = customerOptions(customers);
            const lineContainer = root.querySelector('[data-sale-lines]');
            const addLine = () => {
                const row = document.createElement('div');
                row.className = 'sale-line';
                row.innerHTML = `<select name="sku" required>${productOptions(products.filter((product) => product.activo && product.stock > 0 && !product.stock_pendiente_confirmacion))}</select><input name="cantidad" type="number" min="1" step="1" value="1" required aria-label="Cantidad"><button type="button" class="admin-button admin-button-light">Quitar</button>`;
                row.querySelector('button').addEventListener('click', () => row.remove());
                lineContainer.append(row);
            };
            addLine();
            root.querySelector('[data-add-sale-line]').addEventListener('click', addLine);
            const rows = root.querySelector('[data-sales-rows]');
            const renderRows = () => {
                const recent = sales.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
                rows.innerHTML = recent.length ? recent.map((sale) => `<tr><td><span class="admin-code">${escapeHtml(sale.folio)}</span></td><td>${escapeHtml(customerMap.get(sale.clienteId) || 'Mostrador')}</td><td>${escapeHtml(dateLabel(sale.createdAt))}</td><td>${money(sale.total)}</td><td>${invoiceSet.has(sale.id) ? `<button type="button" class="admin-row-link" data-print-sale="${escapeHtml(sale.id)}">Comprobante</button>` : '—'}</td></tr>`).join('') : makeEmptyRow(5, 'Todavía no hay ventas', 'Registra una venta para comenzar.');
                for (const button of rows.querySelectorAll('[data-print-sale]')) button.addEventListener('click', () => showInvoice(button.dataset.printSale));
            };
            root.querySelector('[data-sale-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const items = [...lineContainer.querySelectorAll('.sale-line')].map((row) => ({
                    sku: row.querySelector('[name="sku"]').value,
                    quantity: Number(row.querySelector('[name="cantidad"]').value),
                }));
                if (!items.length || items.some((item) => !item.sku || !Number.isInteger(item.quantity) || item.quantity < 1)) {
                    feedback('Agrega productos y cantidades válidas a la venta.', true);
                    return;
                }
                try {
                    const sale = await recordSale(customerSelect.value, items);
                    feedback(`Venta ${sale.folio} registrada y existencias actualizadas.`);
                    await renderSales();
                } catch (error) {
                    feedback(error.message, true);
                }
            });
            if (!products.some((product) => product.activo && product.stock > 0 && !product.stock_pendiente_confirmacion)) {
                feedback(products.some((product) => product.activo && product.stock_pendiente_confirmacion)
                    ? 'Confirma el conteo físico de los productos en Inventario antes de vender.'
                    : 'No hay productos activos con stock disponible.', true);
            }
            renderRows();
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderInventory = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Control de existencias</p><h1>Inventario</h1><p class="admin-page-description">Registra entradas, salidas y conteos; cada ajuste queda en el historial local.</p></div></header>
            <div class="admin-team-banner" data-inventory-stock-warning hidden><span class="admin-team-icon" aria-hidden="true">!</span><span><strong>Existencias iniciales sugeridas</strong><small data-inventory-warning-text></small></span></div>
            <section class="admin-stats admin-inventory-stats"><article class="admin-stat-card"><span class="admin-stat-icon icon-blue">U</span><span class="admin-stat-label">Unidades</span><strong data-inventory-units>0</strong><small>En productos activos</small></article><article class="admin-stat-card"><span class="admin-stat-icon icon-amber">!</span><span class="admin-stat-label">Stock bajo</span><strong data-inventory-low>0</strong><small>Productos por revisar</small></article></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">EXISTENCIAS</span><h2>Stock por producto</h2></div></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Producto</th><th>SKU</th><th>Stock</th><th>Mínimo</th><th>Movimiento</th></tr></thead><tbody data-inventory-rows></tbody></table></div></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL</span><h2>Movimientos recientes</h2></div></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Motivo</th><th>Fecha</th></tr></thead><tbody data-movement-rows></tbody></table></div></section>`;
        try {
            const [products, movements] = await Promise.all([getAll('products'), getAll('movements')]);
            root.querySelector('[data-inventory-units]').textContent = products.reduce((sum, product) => sum + Number(product.stock), 0);
            root.querySelector('[data-inventory-low]').textContent = products.filter((product) => product.activo && product.stock <= product.stock_minimo).length;
            const unverifiedStock = products.filter((product) => product.stock_pendiente_confirmacion).length;
            const stockWarning = root.querySelector('[data-inventory-stock-warning]');
            stockWarning.hidden = unverifiedStock === 0;
            root.querySelector('[data-inventory-warning-text]').textContent = unverifiedStock
                ? `Confirma el conteo físico de ${unverifiedStock} productos antes de vender. Usa “Ajustar existencia” en cada producto.`
                : '';
            const rows = root.querySelector('[data-inventory-rows]');
            rows.innerHTML = products.length ? products.map((product) => `<tr>
                <td class="admin-product-name">${escapeHtml(product.nombre)}</td><td><span class="admin-code">${escapeHtml(product.sku)}</span></td>
                <td class="${product.stock <= product.stock_minimo ? 'stock-critical' : 'stock-positive'}">${product.stock} uds.${product.stock_pendiente_confirmacion ? '<small class="admin-stock-unverified">Por confirmar</small>' : ''}</td><td>${product.stock_minimo} uds.</td>
                <td><details class="admin-movement-details"><summary>Registrar movimiento</summary>
                    <form class="inventory-movement-form" data-adjust-form="${escapeHtml(product.sku)}">
                        <label class="admin-field"><span>Tipo de movimiento</span><select name="tipo"><option value="entrada">Entrada</option><option value="salida">Salida</option><option value="ajuste">Ajustar existencia</option></select></label>
                        <label class="admin-field"><span data-adjust-quantity-label>Cantidad</span><input name="cantidad" type="number" min="0" step="1" value="1" required></label>
                        <label class="admin-field"><span>Motivo</span><input name="motivo" maxlength="160" required></label>
                        <button class="admin-button" type="submit">Guardar movimiento</button>
                    </form>
                </details></td></tr>`).join('') : makeEmptyRow(5, 'No hay productos', 'Agrega productos al catálogo para administrar existencias.');
            for (const form of rows.querySelectorAll('[data-adjust-form]')) {
                const type = form.elements.namedItem('tipo');
                const quantityLabel = form.querySelector('[data-adjust-quantity-label]');
                type.addEventListener('change', () => {
                    quantityLabel.textContent = type.value === 'ajuste' ? 'Existencia final' : 'Cantidad';
                });
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const quantity = Number(form.elements.namedItem('cantidad').value);
                    const reason = String(form.elements.namedItem('motivo').value).trim();
                    if (!Number.isInteger(quantity) || quantity < 0 || (type.value !== 'ajuste' && quantity < 1) || !reason) {
                        feedback('Indica una cantidad válida y el motivo del movimiento.', true);
                        return;
                    }
                    try {
                        await adjustProductStock(form.dataset.adjustForm, quantity, type.value, reason);
                        feedback('Inventario actualizado y movimiento guardado.');
                        await renderInventory();
                    } catch (error) {
                        feedback(error.message, true);
                    }
                });
            }
            const movementRows = root.querySelector('[data-movement-rows]');
            const productMap = new Map(products.map((product) => [product.sku, product.nombre]));
            const recent = movements.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
            movementRows.innerHTML = recent.length ? recent.map((movement) => `<tr><td>${escapeHtml(movement.tipo)}</td><td>${escapeHtml(productMap.get(movement.sku) || movement.sku)}</td><td>${movement.cantidad > 0 ? '+' : ''}${movement.cantidad}</td><td>${escapeHtml(movement.motivo)}</td><td>${escapeHtml(dateLabel(movement.createdAt))}</td></tr>`).join('') : makeEmptyRow(5, 'Sin movimientos', 'Las entradas y salidas aparecerán aquí.');
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderPurchases = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Egresos</p><h1>Compras y Gastos</h1><p class="admin-page-description">Las compras aumentan existencias; los gastos quedan en el reporte financiero.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVO REGISTRO</span><h2>Compra o gasto</h2></div></div>
                <form class="admin-form-grid" data-purchase-form>
                    <label class="admin-field"><span>Tipo</span><select name="tipo"><option value="compra">Compra de producto</option><option value="gasto">Gasto operativo</option></select></label>
                    <label class="admin-field"><span>Proveedor</span><input name="proveedor" maxlength="160"></label>
                    <label class="admin-field admin-field-wide"><span>Descripción <i>*</i></span><input name="descripcion" maxlength="255" required></label>
                    <label class="admin-field" data-purchase-product><span>Producto</span><select name="sku"></select></label>
                    <label class="admin-field" data-purchase-quantity><span>Unidades</span><input name="cantidad" type="number" min="1" step="1" value="1"></label>
                    <label class="admin-field"><span data-purchase-amount>Costo por unidad (MXN)</span><input name="importe" type="number" min="0.01" step="0.01" required></label>
                    <div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar registro</button></div>
                </form></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL</span><h2>Compras y gastos recientes</h2></div></div>
                <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Tipo</th><th>Descripción</th><th>Producto</th><th>Proveedor</th><th>Fecha</th><th>Total</th></tr></thead><tbody data-purchase-rows></tbody></table></div></section>`;
        try {
            const [products, records] = await Promise.all([getAll('products'), getAll('transactions')]);
            const form = root.querySelector('[data-purchase-form]');
            const type = form.elements.namedItem('tipo');
            const productField = root.querySelector('[data-purchase-product]');
            const quantityField = root.querySelector('[data-purchase-quantity]');
            const quantity = form.elements.namedItem('cantidad');
            const product = form.elements.namedItem('sku');
            product.innerHTML = productOptions(products.filter((item) => item.activo));
            const toggle = () => {
                const isPurchase = type.value === 'compra';
                productField.hidden = !isPurchase;
                quantityField.hidden = !isPurchase;
                product.required = isPurchase;
                quantity.required = isPurchase;
                root.querySelector('[data-purchase-amount]').textContent = isPurchase ? 'Costo por unidad (MXN)' : 'Importe total (MXN)';
            };
            type.addEventListener('change', toggle);
            toggle();
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(form);
                const isPurchase = values.get('tipo') === 'compra';
                const record = {
                    id: newId(), tipo: isPurchase ? 'compra' : 'gasto',
                    descripcion: String(values.get('descripcion')).trim(),
                    proveedor: String(values.get('proveedor')).trim(),
                    sku: isPurchase ? String(values.get('sku')) : '',
                    cantidad: isPurchase ? Number(values.get('cantidad')) : 1,
                    importe: Number(values.get('importe')),
                    createdAt: new Date().toISOString(),
                };
                if (!record.descripcion || record.importe <= 0 || (isPurchase && (!record.sku || record.cantidad < 1))) {
                    feedback('Completa los datos de la compra o gasto.', true);
                    return;
                }
                try {
                    await recordPurchaseOrExpense(record);
                    feedback(isPurchase ? 'Compra registrada y existencias actualizadas.' : 'Gasto guardado.');
                    await renderPurchases();
                } catch (error) {
                    feedback(error.message, true);
                }
            });
            const rows = root.querySelector('[data-purchase-rows]');
            const recent = records.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
            rows.innerHTML = recent.length ? recent.map((record) => `<tr><td>${record.tipo === 'compra' ? 'Compra' : 'Gasto'}</td><td class="admin-product-name">${escapeHtml(record.descripcion)}</td><td>${escapeHtml(record.producto || '—')}</td><td>${escapeHtml(record.proveedor || '—')}</td><td>${escapeHtml(dateLabel(record.createdAt))}</td><td>${money(record.total)}</td></tr>`).join('') : makeEmptyRow(6, 'Sin compras ni gastos', 'Registra una operación para comenzar.');
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderReports = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Análisis</p><h1>Reportes</h1><p class="admin-page-description">Filtra ventas, compras, gastos y productos más vendidos.</p></div></header>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">PERIODO</span><h2>Seleccionar fechas</h2></div></div>
                <form class="admin-form-grid admin-report-filter" data-report-form><label class="admin-field"><span>Desde</span><input type="date" name="desde" required></label><label class="admin-field"><span>Hasta</span><input type="date" name="hasta" required></label><div class="admin-form-actions"><button class="admin-button" type="submit">Actualizar</button></div></form></section>
            <section class="admin-stats admin-local-stats"><article class="admin-stat-card"><span class="admin-stat-icon icon-blue">V</span><span class="admin-stat-label">Ventas</span><strong data-report-sales>0</strong><small>Operaciones</small></article><article class="admin-stat-card"><span class="admin-stat-icon icon-green">$</span><span class="admin-stat-label">Ingresos</span><strong data-report-revenue>$0</strong><small>MXN</small></article><article class="admin-stat-card"><span class="admin-stat-icon icon-amber">$</span><span class="admin-stat-label">Compras</span><strong data-report-purchases>$0</strong><small>MXN</small></article><article class="admin-stat-card"><span class="admin-stat-icon icon-purple">$</span><span class="admin-stat-label">Gastos</span><strong data-report-expenses>$0</strong><small>MXN</small></article></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">PRODUCTOS</span><h2>Más vendidos</h2></div></div><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Producto</th><th>Unidades</th><th>Total</th></tr></thead><tbody data-report-rows></tbody></table></div></section>`;
        const form = root.querySelector('[data-report-form]');
        const today = localDate();
        form.elements.namedItem('hasta').value = today;
        form.elements.namedItem('desde').value = `${today.slice(0, 7)}-01`;
        const draw = async (event) => {
            if (event) event.preventDefault();
            const from = form.elements.namedItem('desde').value;
            const to = form.elements.namedItem('hasta').value;
            if (from > to) {
                feedback('La fecha inicial debe ser anterior a la fecha final.', true);
                return;
            }
            const [sales, transactions] = await Promise.all([getAll('sales'), getAll('transactions')]);
            const inPeriod = (record) => {
                const date = localDate(new Date(record.createdAt));
                return date >= from && date <= to;
            };
            const filteredSales = sales.filter(inPeriod);
            const filteredTransactions = transactions.filter(inPeriod);
            root.querySelector('[data-report-sales]').textContent = filteredSales.length;
            root.querySelector('[data-report-revenue]').textContent = money(filteredSales.reduce((sum, sale) => sum + sale.total, 0));
            root.querySelector('[data-report-purchases]').textContent = money(filteredTransactions.filter((item) => item.tipo === 'compra').reduce((sum, item) => sum + item.total, 0));
            root.querySelector('[data-report-expenses]').textContent = money(filteredTransactions.filter((item) => item.tipo === 'gasto').reduce((sum, item) => sum + item.total, 0));
            const grouped = new Map();
            for (const sale of filteredSales) for (const item of sale.items) {
                const saved = grouped.get(item.sku) || { nombre: item.nombre, unidades: 0, total: 0 };
                saved.unidades += item.cantidad;
                saved.total += item.total;
                grouped.set(item.sku, saved);
            }
            const best = [...grouped.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 10);
            root.querySelector('[data-report-rows]').innerHTML = best.length ? best.map((item) => `<tr><td class="admin-product-name">${escapeHtml(item.nombre)}</td><td>${item.unidades}</td><td>${money(item.total)}</td></tr>`).join('') : makeEmptyRow(3, 'Sin ventas en este periodo', 'Registra ventas para ver los productos más vendidos.');
        };
        form.addEventListener('submit', (event) => draw(event).catch((error) => feedback(error.message, true)));
        try { await draw(); } catch (error) { feedback(error.message, true); }
    };

    const renderInvoices = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Comprobantes</p><h1>Facturación</h1><p class="admin-page-description">Genera e imprime comprobantes internos asociados a ventas.</p></div></header>
            <div class="admin-team-banner"><span class="admin-team-icon" aria-hidden="true">i</span><span><strong>No es una factura fiscal</strong><small>Estos comprobantes no son CFDI ni sustituyen el timbrado del SAT.</small></span></div>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVO COMPROBANTE</span><h2>Datos del receptor</h2></div></div>
                <form class="admin-form-grid" data-invoice-form><label class="admin-field admin-field-wide"><span>Venta sin comprobante</span><select name="saleId" required></select></label><label class="admin-field"><span>Nombre o razón social</span><input name="razon_social" maxlength="160" required></label><label class="admin-field"><span>RFC (opcional)</span><input name="rfc" maxlength="20"></label><label class="admin-field admin-field-wide"><span>Domicilio</span><input name="domicilio" maxlength="255"></label><div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Crear comprobante</button></div></form>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL</span><h2>Comprobantes emitidos</h2></div></div><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Folio</th><th>Venta</th><th>Receptor</th><th>Fecha</th><th>Total</th><th></th></tr></thead><tbody data-invoice-rows></tbody></table></div></section>
            <section class="admin-panel" data-invoice-output hidden></section>`;
        try {
            const [sales, invoices] = await Promise.all([getAll('sales'), getAll('invoices')]);
            const invoiceSet = new Set(invoices.map((invoice) => invoice.saleId));
            const available = sales.filter((sale) => sale.estado === 'completada' && !invoiceSet.has(sale.id));
            const select = root.querySelector('[data-invoice-form] select');
            select.innerHTML = `<option value="">${available.length ? 'Seleccionar venta' : 'No hay ventas pendientes'}</option>${available.map((sale) => `<option value="${escapeHtml(sale.id)}">${escapeHtml(sale.folio)} · ${money(sale.total)}</option>`).join('')}`;
            select.disabled = !available.length;
            root.querySelector('[data-invoice-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                const saleId = String(values.get('saleId'));
                const sale = sales.find((item) => item.id === saleId);
                if (!sale || !String(values.get('razon_social')).trim()) return;
                const invoice = {
                    saleId, folio: `CBX-CMP-${localDate().replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
                    razon_social: String(values.get('razon_social')).trim(), rfc: String(values.get('rfc')).trim().toUpperCase(),
                    domicilio: String(values.get('domicilio')).trim(), createdAt: new Date().toISOString(),
                };
                await putRecord('invoices', invoice);
                feedback('Comprobante interno creado. No es un CFDI.');
                await renderInvoices();
                await showInvoice(saleId);
            });
            const rows = root.querySelector('[data-invoice-rows]');
            rows.innerHTML = invoices.length ? invoices.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((invoice) => {
                const sale = sales.find((item) => item.id === invoice.saleId);
                return `<tr><td><span class="admin-code">${escapeHtml(invoice.folio)}</span></td><td>${escapeHtml(sale?.folio || '—')}</td><td>${escapeHtml(invoice.razon_social)}</td><td>${escapeHtml(dateLabel(invoice.createdAt))}</td><td>${money(sale?.total || 0)}</td><td><button type="button" class="admin-row-link" data-print-sale="${escapeHtml(invoice.saleId)}">Imprimir</button></td></tr>`;
            }).join('') : makeEmptyRow(6, 'Sin comprobantes', 'Las ventas completadas aparecen disponibles para facturar.');
            for (const button of rows.querySelectorAll('[data-print-sale]')) button.addEventListener('click', () => showInvoice(button.dataset.printSale));
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const showInvoice = async (saleId) => {
        const [sales, invoices, settings] = await Promise.all([getAll('sales'), getAll('invoices'), readSettings()]);
        const sale = sales.find((item) => item.id === saleId);
        const invoice = invoices.find((item) => item.saleId === saleId);
        if (!sale || !invoice) {
            feedback('No se encontró el comprobante local.', true);
            return;
        }
        const customers = await getAll('customers');
        const customer = customers.find((item) => item.id === sale.clienteId);
        const output = root.querySelector('[data-invoice-output]') || root.appendChild(document.createElement('section'));
        output.className = 'admin-panel invoice-panel';
        output.hidden = false;
        output.innerHTML = `<div class="invoice-toolbar"><button class="admin-button admin-button-light" type="button" data-close-invoice>Cerrar</button><button class="admin-button" type="button" data-print-invoice>Imprimir</button></div><article class="invoice-paper">
            <p class="admin-eyebrow">COMPROBANTE INTERNO · NO ES CFDI</p><h2>${escapeHtml(settings.nombre_tienda)}</h2>
            <div class="invoice-meta"><span>Folio <strong>${escapeHtml(invoice.folio)}</strong></span><span>Fecha <strong>${escapeHtml(dateLabel(invoice.createdAt))}</strong></span><span>Venta <strong>${escapeHtml(sale.folio)}</strong></span></div>
            <h3>Receptor</h3><p>${escapeHtml(invoice.razon_social)}</p><p>${invoice.rfc ? `RFC: ${escapeHtml(invoice.rfc)}` : ''}</p><p>${escapeHtml(invoice.domicilio || '')}</p>
            <div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Producto</th><th>SKU</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr></thead><tbody>${sale.items.map((item) => `<tr><td>${escapeHtml(item.nombre)}</td><td>${escapeHtml(item.sku)}</td><td>${item.cantidad}</td><td>${money(item.precio)}</td><td>${money(item.total)}</td></tr>`).join('')}</tbody></table></div>
            <div class="invoice-totals"><p>Subtotal <strong>${money(sale.subtotal)}</strong></p><p>Impuesto <strong>${money(sale.impuesto)}</strong></p><p>Total <strong>${money(sale.total)}</strong></p></div>
            <p class="invoice-disclaimer">Documento interno. No acredita una factura fiscal ni sustituye un CFDI timbrado por un PAC autorizado.</p></article>`;
        output.querySelector('[data-close-invoice]').addEventListener('click', () => { output.hidden = true; });
        output.querySelector('[data-print-invoice]').addEventListener('click', () => window.print());
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const renderEmployees = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Equipo de tienda</p><h1>Empleados IA</h1><p class="admin-page-description">Gestiona el directorio y estado del equipo en este navegador.</p></div></header>
            <div class="admin-team-banner"><span class="admin-team-icon" aria-hidden="true">i</span><span><strong>Directorio de empleados</strong><small>No incluye una conexión a servicios de inteligencia artificial.</small></span></div>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVO EMPLEADO</span><h2>Agregar al equipo</h2></div></div>
                <form class="admin-form-grid" data-employee-form><label class="admin-field"><span>Nombre <i>*</i></span><input name="nombre" maxlength="120" required></label><label class="admin-field"><span>Puesto <i>*</i></span><input name="puesto" maxlength="120" required></label><label class="admin-field"><span>Correo</span><input name="email" type="email" maxlength="160"></label><label class="admin-field"><span>Teléfono</span><input name="telefono" maxlength="40"></label><div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar empleado</button></div></form>
            </section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">DIRECTORIO</span><h2>Personal registrado</h2></div></div><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Nombre</th><th>Puesto</th><th>Correo</th><th>Teléfono</th><th>Estado</th><th></th></tr></thead><tbody data-employee-rows></tbody></table></div></section>`;
        try {
            const employees = await getAll('employees');
            root.querySelector('[data-employee-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                await putRecord('employees', {
                    id: newId(), nombre: String(values.get('nombre')).trim(), puesto: String(values.get('puesto')).trim(),
                    email: String(values.get('email')).trim(), telefono: String(values.get('telefono')).trim(),
                    activo: 1, createdAt: new Date().toISOString(),
                });
                feedback('Empleado guardado en este navegador.');
                await renderEmployees();
            });
            const rows = root.querySelector('[data-employee-rows]');
            rows.innerHTML = employees.length ? employees.map((employee) => `<tr><td class="admin-product-name">${escapeHtml(employee.nombre)}</td><td>${escapeHtml(employee.puesto)}</td><td>${escapeHtml(employee.email || '—')}</td><td>${escapeHtml(employee.telefono || '—')}</td><td><span class="admin-badge ${employee.activo ? 'badge-success' : 'badge-neutral'}">${employee.activo ? 'Activo' : 'Inactivo'}</span></td><td><button class="admin-row-link" type="button" data-employee="${escapeHtml(employee.id)}">${employee.activo ? 'Desactivar' : 'Activar'}</button></td></tr>`).join('') : makeEmptyRow(6, 'Sin empleados', 'Agrega al equipo de la tienda.');
            for (const button of rows.querySelectorAll('[data-employee]')) button.addEventListener('click', async () => {
                const employee = employees.find((item) => item.id === button.dataset.employee);
                employee.activo = employee.activo ? 0 : 1;
                await putRecord('employees', employee);
                await renderEmployees();
            });
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderNews = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Comunicaciones</p><h1>Novedades</h1><p class="admin-page-description">Publica y archiva avisos para el equipo.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVO AVISO</span><h2>Publicar novedad</h2></div></div><form class="admin-form-grid" data-news-form><label class="admin-field admin-field-wide"><span>Título <i>*</i></span><input name="titulo" maxlength="160" required></label><label class="admin-field admin-field-wide"><span>Contenido <i>*</i></span><textarea name="contenido" rows="4" maxlength="4000" required></textarea></label><div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Publicar aviso</button></div></form></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">TABLÓN</span><h2>Avisos registrados</h2></div></div><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Título</th><th>Contenido</th><th>Fecha</th><th>Estado</th><th></th></tr></thead><tbody data-news-rows></tbody></table></div></section>`;
        try {
            const announcements = await getAll('announcements');
            root.querySelector('[data-news-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                await putRecord('announcements', { id: newId(), titulo: String(values.get('titulo')).trim(), contenido: String(values.get('contenido')).trim(), visible: 1, createdAt: new Date().toISOString() });
                feedback('Novedad publicada en el tablón local.');
                await renderNews();
            });
            const rows = root.querySelector('[data-news-rows]');
            rows.innerHTML = announcements.length ? announcements.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((item) => `<tr><td class="admin-product-name">${escapeHtml(item.titulo)}</td><td class="admin-cell-wrap">${escapeHtml(item.contenido)}</td><td>${escapeHtml(dateLabel(item.createdAt))}</td><td>${item.visible ? 'Publicada' : 'Archivada'}</td><td><button class="admin-row-link" type="button" data-news="${escapeHtml(item.id)}">${item.visible ? 'Archivar' : 'Publicar'}</button></td></tr>`).join('') : makeEmptyRow(5, 'Sin novedades', 'Publica un aviso para el equipo.');
            for (const button of rows.querySelectorAll('[data-news]')) button.addEventListener('click', async () => {
                const item = announcements.find((entry) => entry.id === button.dataset.news);
                item.visible = item.visible ? 0 : 1;
                await putRecord('announcements', item);
                await renderNews();
            });
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderSupport = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Ayuda</p><h1>Contactar a Soporte</h1><p class="admin-page-description">Registra solicitudes y consulta su estado en este navegador.</p></div></header>
            <div class="admin-team-banner"><span class="admin-team-icon" aria-hidden="true">i</span><span><strong>Registro local</strong><small>No se envían mensajes a un equipo externo de soporte.</small></span></div>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">NUEVA SOLICITUD</span><h2>Describir el problema</h2></div></div><form class="admin-form-grid" data-support-form><label class="admin-field admin-field-wide"><span>Asunto <i>*</i></span><input name="asunto" maxlength="160" required></label><label class="admin-field admin-field-wide"><span>Mensaje <i>*</i></span><textarea name="mensaje" rows="4" maxlength="4000" required></textarea></label><div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar solicitud</button></div></form></section>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">HISTORIAL LOCAL</span><h2>Solicitudes guardadas</h2></div></div><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>Asunto</th><th>Mensaje</th><th>Fecha</th><th>Estado</th><th></th></tr></thead><tbody data-support-rows></tbody></table></div></section>`;
        try {
            const tickets = await getAll('tickets');
            root.querySelector('[data-support-form]').addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                await putRecord('tickets', { id: newId(), asunto: String(values.get('asunto')).trim(), mensaje: String(values.get('mensaje')).trim(), estado: 'abierto', createdAt: new Date().toISOString() });
                feedback('Solicitud guardada localmente.');
                await renderSupport();
            });
            const rows = root.querySelector('[data-support-rows]');
            rows.innerHTML = tickets.length ? tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((ticket) => `<tr><td class="admin-product-name">${escapeHtml(ticket.asunto)}</td><td class="admin-cell-wrap">${escapeHtml(ticket.mensaje)}</td><td>${escapeHtml(dateLabel(ticket.createdAt))}</td><td>${ticket.estado === 'abierto' ? 'Abierta' : 'Cerrada'}</td><td><button class="admin-row-link" type="button" data-ticket="${escapeHtml(ticket.id)}">${ticket.estado === 'abierto' ? 'Cerrar' : 'Reabrir'}</button></td></tr>`).join('') : makeEmptyRow(5, 'Sin solicitudes', 'Las solicitudes guardadas aparecerán aquí.');
            for (const button of rows.querySelectorAll('[data-ticket]')) button.addEventListener('click', async () => {
                const ticket = tickets.find((item) => item.id === button.dataset.ticket);
                ticket.estado = ticket.estado === 'abierto' ? 'cerrado' : 'abierto';
                await putRecord('tickets', ticket);
                await renderSupport();
            });
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderSettings = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Configuración</p><h1>Preferencias</h1><p class="admin-page-description">Ajusta los datos de la tienda usados por el punto de venta y WhatsApp.</p></div></header>
            <section class="admin-panel admin-form-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">DATOS LOCALES</span><h2>Configuración de tienda</h2><p>El impuesto se aplica a las ventas nuevas.</p></div></div><form class="admin-form-grid" data-settings-form>
                <label class="admin-field"><span>Nombre de la tienda <i>*</i></span><input name="nombre_tienda" maxlength="120" required></label>
                <label class="admin-field"><span>Moneda</span><input value="Peso mexicano (MXN)" readonly></label>
                <label class="admin-field"><span>Impuesto (%)</span><input name="tasa_impuesto" type="number" min="0" max="100" step="0.01" required></label>
                <label class="admin-field"><span>Teléfono WhatsApp con código de país</span><input name="whatsapp_telefono" type="tel" inputmode="numeric" maxlength="15" placeholder="5215512345678"><small>Solo dígitos, con prefijo internacional.</small></label>
                <label class="admin-field admin-field-wide"><span>Mensaje inicial</span><textarea name="whatsapp_mensaje" rows="3" maxlength="500"></textarea></label>
                <div class="admin-form-actions admin-field-wide"><button class="admin-button" type="submit">Guardar preferencias</button></div></form></section>
            <p class="admin-local-notice">Estos datos viven en IndexedDB de este navegador y no se sincronizan.</p>`;
        try {
            const settings = await readSettings();
            const form = root.querySelector('[data-settings-form]');
            for (const [key, value] of Object.entries(settings)) form.elements.namedItem(key).value = value;
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const values = new FormData(form);
                const phoneInput = String(values.get('whatsapp_telefono')).trim();
                const phone = phoneInput.replace(/\D/g, '');
                const tax = Number(values.get('tasa_impuesto'));
                if (phoneInput && (!/^\+?[\d\s().-]+$/.test(phoneInput) || phone.length < 10 || phone.length > 15)) {
                    feedback('Escribe un teléfono con código de país y solo números.', true);
                    return;
                }
                if (!Number.isFinite(tax) || tax < 0 || tax > 100) {
                    feedback('El impuesto debe estar entre 0 y 100%.', true);
                    return;
                }
                await saveSettings({
                    nombre_tienda: String(values.get('nombre_tienda')).trim(),
                    tasa_impuesto: tax,
                    whatsapp_telefono: phone,
                    whatsapp_mensaje: String(values.get('whatsapp_mensaje')).trim(),
                });
                feedback('Preferencias guardadas en este navegador.');
            });
        } catch (error) {
            feedback(error.message, true);
        }
    };

    const renderWhatsApp = async () => {
        root.innerHTML = `
            <header class="admin-page-heading"><div><p class="admin-eyebrow">Canal de venta</p><h1>WhatsApp</h1><p class="admin-page-description">Abre una conversación o comparte el catálogo mediante un enlace.</p></div></header>
            <section class="admin-panel"><div class="admin-panel-heading"><div><span class="admin-section-kicker">CONTACTO</span><h2 data-whatsapp-store>Canal de la tienda</h2><p data-whatsapp-status>Consultando preferencias...</p></div></div>
                <div class="admin-panel-heading"><div><strong data-whatsapp-phone>Sin configurar</strong><p data-whatsapp-message></p></div><a class="admin-button" data-whatsapp-link hidden target="_blank" rel="noopener">Abrir WhatsApp</a></div>
                <div class="admin-panel-heading"><p>Este enlace usa wa.me. No envía mensajes automáticos ni conecta una API.</p><a class="admin-button admin-button-light" href="#settings">Configurar canal</a></div></section>
            <section class="admin-panel">            <div class="admin-panel-heading"><div><span class="admin-section-kicker">CATÁLOGO</span><h2>Catálogo en línea</h2><p>Comparte la tienda pública con tus clientes.</p></div><a class="admin-button" target="_blank" rel="noopener" href="/CLINIBOX/CLINIBOX/app/views/tienda/tienda.html">Abrir catálogo</a></div></section>`;
        const settings = await readSettings();
        const phone = String(settings.whatsapp_telefono || '').replace(/\D/g, '');
        root.querySelector('[data-whatsapp-store]').textContent = settings.nombre_tienda;
        root.querySelector('[data-whatsapp-phone]').textContent = phone ? `+${phone}` : 'Sin configurar';
        root.querySelector('[data-whatsapp-message]').textContent = settings.whatsapp_mensaje;
        const link = root.querySelector('[data-whatsapp-link]');
        if (phone.length < 10 || phone.length > 15) {
            root.querySelector('[data-whatsapp-status]').textContent = 'Configura un teléfono con prefijo internacional en Preferencias.';
            link.hidden = true;
            return;
        }
        const chat = new URL(`https://wa.me/${phone}`);
        chat.searchParams.set('text', `${settings.whatsapp_mensaje}\n${settings.nombre_tienda}`);
        link.href = chat.href;
        link.hidden = false;
        root.querySelector('[data-whatsapp-status]').textContent = 'Enlace directo listo. La conversación se abrirá en WhatsApp.';
    };

    const renderPage = async () => {
        const page = location.hash.slice(1) || 'home';
        const handlers = {
            home: renderHome,
            products: renderProducts,
            sales: renderSales,
            customers: renderCustomers,
            reports: renderReports,
            purchases: renderPurchases,
            invoices: renderInvoices,
            employees: renderEmployees,
            inventory: renderInventory,
            whatsapp: renderWhatsApp,
            news: renderNews,
            support: renderSupport,
            settings: renderSettings,
        };
        if (!handlers[page]) {
            location.hash = 'home';
            return;
        }
        feedback('');
        setPageHeader(page);
        loadNav(page);
        try {
            await databaseReady;
            await handlers[page]();
        } catch (error) {
            root.innerHTML = '<section class="admin-panel"><div class="admin-empty-inline"><strong>No se pudo abrir el almacenamiento local</strong><span data-storage-error></span></div></section>';
            root.querySelector('[data-storage-error]').textContent = error.message;
            feedback(error.message, true);
        }
    };

    window.addEventListener('hashchange', renderPage);
    renderPage();
})();
