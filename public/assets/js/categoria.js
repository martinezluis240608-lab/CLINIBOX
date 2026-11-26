/* La tienda de categorías solo muestra productos registrados en MySQL. */
(function () {
    const API_URL = '/CLINIBOX/public/api/farmacia?resource=products';
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('categoria') || 'medicamentos';
    const catalog = [];
    let activeFilter = 'todos';
    let searchText = '';

    const categoryInfo = {
        'medicamentos': ['Medicamentos', 'Productos registrados en el catálogo de farmacia.'],
        'cuidado-personal': ['Cuidado personal', 'Productos registrados en esta categoría.'],
        'dermatologia': ['Dermatología', 'Productos registrados en esta categoría.'],
        'salud-bienestar': ['Salud y bienestar', 'Productos registrados en esta categoría.'],
        'salud-y-bienestar': ['Salud y bienestar', 'Productos registrados en esta categoría.'],
        'primeros-auxilios': ['Primeros auxilios', 'Productos registrados en esta categoría.'],
        'equipo-medico': ['Equipo médico', 'Productos registrados en esta categoría.'],
        'accesorios': ['Accesorios', 'Productos registrados en esta categoría.']
    };
    const aliases = {
        'salud-bienestar': ['salud-bienestar', 'salud-y-bienestar'],
        'salud-y-bienestar': ['salud-bienestar', 'salud-y-bienestar']
    };

    const title = document.getElementById('categoryTitle');
    const description = document.getElementById('categoryDescription');
    const count = document.getElementById('categoryProductCount');
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyProducts');
    const resultCount = document.getElementById('resultCount');
    const search = document.getElementById('storeSearch');
    const searchBox = document.querySelector('.shop-search');
    const searchToggle = document.querySelector('.search-toggle');
    const sort = document.getElementById('categorySort');
    const returnLink = document.getElementById('pharmacyReturnLink');

    function slug(value) {
        return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
        });
    }

    function money(value) {
        return Number(value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }

    function isInCategory(product) {
        const accepted = aliases[categorySlug] || [categorySlug];
        return accepted.includes(slug(product.category));
    }

    function favoriteId(product) {
        return 'producto:' + String(product.id);
    }

    function detailsUrl(product) {
        return '/CLINIBOX/public/producto?' + new URLSearchParams({ id: String(product.id) }).toString();
    }

    function getVisibleProducts() {
        let rows = searchText ? catalog.slice() : catalog.filter(isInCategory);
        if (searchText) {
            rows = rows.filter(function (product) {
                return (String(product.name) + ' ' + String(product.category) + ' ' + String(product.barcode || ''))
                    .toLocaleLowerCase('es-MX').includes(searchText);
            });
        }
        if (activeFilter === 'disponibles') rows = rows.filter(function (product) { return Number(product.stock) > 0; });
        if (activeFilter === 'agotados') rows = rows.filter(function (product) { return Number(product.stock) <= 0; });

        if (sort && sort.value === 'precio-menor') rows.sort(function (a, b) { return Number(a.price) - Number(b.price); });
        else if (sort && sort.value === 'precio-mayor') rows.sort(function (a, b) { return Number(b.price) - Number(a.price); });
        else rows.sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'es'); });
        return rows;
    }

    function render() {
        const selectedCategory = categoryInfo[categorySlug] || [categorySlug.replace(/-/g, ' '), 'Productos registrados en esta categoría.'];
        const categoryProducts = catalog.filter(isInCategory);
        const rows = getVisibleProducts();
        if (title) title.textContent = searchText ? 'Resultados de búsqueda' : selectedCategory[0];
        if (description) description.textContent = searchText ? 'Resultados del catálogo registrado.' : selectedCategory[1];
        if (count) count.textContent = String(searchText ? rows.length : categoryProducts.length);
        if (resultCount) resultCount.textContent = rows.length + (rows.length === 1 ? ' producto' : ' productos');
        if (grid) grid.innerHTML = '';
        if (empty) empty.style.display = rows.length ? 'none' : 'block';
        if (!grid || !rows.length) {
            if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
            return;
        }

        rows.forEach(function (product, index) {
            const card = document.createElement('article');
            const available = Number(product.stock) > 0;
            const isFavorite = window.cliniboxFavorites && window.cliniboxFavorites.has(favoriteId(product));
            card.className = 'category-product-card';
            card.style.animationDelay = (index * 60) + 'ms';
            card.innerHTML = '<div class="category-product-image">' +
                '<button class="category-favorite-button' + (isFavorite ? ' active' : '') + '" type="button" aria-label="' + (isFavorite ? 'Quitar de' : 'Agregar a') + ' favoritos" aria-pressed="' + String(Boolean(isFavorite)) + '"><i data-lucide="heart"></i></button>' +
                '<span>' + escapeHtml(product.emoji || '💊') + '</span></div>' +
                '<div class="category-product-info"><h3>' + escapeHtml(product.name) + '</h3>' +
                '<small class="product-barcode-meta">Código: ' + escapeHtml(product.barcode || 'No registrado') + '</small>' +
                '<p class="category-product-description">' + escapeHtml(product.description || 'Sin descripción registrada.') + '</p>' +
                '<a class="category-product-view" href="' + escapeHtml(detailsUrl(product)) + '"><i data-lucide="eye"></i> Ver producto</a>' +
                '<div class="category-price"><strong>' + money(product.price) + '</strong></div>' +
                '<small>' + (available ? 'Existencias: ' + Number(product.stock) : 'Agotado') + '</small>' +
                '<button class="category-add-cart" type="button" ' + (available ? '' : 'disabled') + ' aria-label="Agregar ' + escapeHtml(product.name) + ' al carrito" title="' + (available ? 'Agregar al carrito' : 'Producto agotado') + '"><i data-lucide="shopping-cart" aria-hidden="true"></i></button></div>';

            const favoriteButton = card.querySelector('.category-favorite-button');
            favoriteButton.addEventListener('click', function () {
                const added = window.cliniboxFavorites.toggle({
                    id: favoriteId(product), name: product.name, category: product.category,
                    price: Number(product.price), emoji: product.emoji || '💊', oldPrice: Number(product.price)
                });
                favoriteButton.classList.toggle('active', added);
                favoriteButton.setAttribute('aria-pressed', String(added));
                favoriteButton.setAttribute('aria-label', (added ? 'Quitar de' : 'Agregar a') + ' favoritos');
            });

            const addButton = card.querySelector('.category-add-cart');
            addButton.addEventListener('click', function () {
                window.cliniboxCart.add({
                    id: Number(product.id), name: product.name, category: product.category,
                    price: Number(product.price), oldPrice: Number(product.price),
                    emoji: product.emoji || '💊', barcode: product.barcode, quantity: 1
                });
                addButton.classList.add('added');
                addButton.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>';
                if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
                window.setTimeout(function () {
                    addButton.classList.remove('added');
                    addButton.innerHTML = '<i data-lucide="shopping-cart" aria-hidden="true"></i>';
                    if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
                }, 1200);
            });
            grid.appendChild(card);
        });
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    document.querySelectorAll('.shop-category').forEach(function (link) {
        link.classList.toggle('active', link.dataset.category === categorySlug);
    });
    document.querySelectorAll('.category-filter').forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.dataset.filter || 'todos';
            document.querySelectorAll('.category-filter').forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            render();
        });
    });
    if (sort) sort.addEventListener('change', render);
    if (search) search.addEventListener('input', function () {
        searchText = search.value.trim().toLocaleLowerCase('es-MX');
        render();
    });
    const showAll = document.getElementById('btnMostrarTodos');
    if (showAll) showAll.addEventListener('click', function () {
        if (search) search.value = '';
        searchText = '';
        activeFilter = 'todos';
        document.querySelectorAll('.category-filter').forEach(function (button) {
            button.classList.toggle('active', button.dataset.filter === 'todos');
        });
        render();
    });
    if (returnLink && ['paciente', 'farmacia'].includes(params.get('origen'))) returnLink.hidden = false;
    if (search && searchBox && searchToggle) {
        const closeSearch = function () {
            searchBox.classList.remove('is-open');
            searchToggle.setAttribute('aria-expanded', 'false');
        };
        searchToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            const isOpen = searchBox.classList.toggle('is-open');
            searchToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) search.focus();
        });
        search.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeSearch();
                searchToggle.focus();
            }
        });
        document.addEventListener('click', function (event) {
            if (!searchBox.contains(event.target)) closeSearch();
        });
    }

    const cart = window.cliniboxCart.all();
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = String(cart.reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0));

    fetch(API_URL, { credentials: 'same-origin', cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
            return response.json();
        })
        .then(function (data) {
            catalog.push.apply(catalog, (data.products || []).map(function (product) {
                return Object.assign({}, product, { id: Number(product.id), price: Number(product.price), stock: Number(product.stock) });
            }));
            const validIds = new Set(catalog.map(function (product) { return String(product.id); }));
            const currentCart = window.cliniboxCart.all().filter(function (item) { return validIds.has(String(item.id)); });
            localStorage.setItem('cliniboxCart', JSON.stringify(currentCart));
            if (cartCount) cartCount.textContent = String(currentCart.reduce(function (sum, item) { return sum + Number(item.quantity || 0); }, 0));
            render();
        })
        .catch(function () {
            render();
            if (description) description.textContent = 'No se pudo cargar el catálogo. Intenta de nuevo más tarde.';
        });
})();
