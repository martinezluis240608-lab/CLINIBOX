/* =========================================================
   CLINIBOX - TIENDA
   FUNCIONALIDAD DEL NUEVO DISEÑO
   ========================================================= */


/* =========================================================
   PRODUCTOS
========================================================= */

const products = [

    {
        id: 1,
        name: "Paracetamol 500 mg",
        category: "Medicamentos",
        price: 45,
        oldPrice: 60,
        emoji: "💊",
        discount: 25,
        badge: "Oferta",
        popular: true
    },

    {
        id: 2,
        name: "Vitamina C 1000 mg",
        category: "Vitaminas y suplementos",
        price: 120,
        oldPrice: 150,
        emoji: "🍊",
        discount: 20,
        badge: "Top",
        popular: true
    },

    {
        id: 3,
        name: "Termómetro digital",
        category: "Equipo médico",
        price: 85,
        oldPrice: 110,
        emoji: "🌡️",
        discount: 23,
        badge: "Nuevo",
        popular: true
    },

    {
        id: 4,
        name: "Gasas estériles",
        category: "Primeros auxilios",
        price: 60,
        oldPrice: 75,
        emoji: "▤",
        discount: 20,
        badge: "Oferta",
        popular: true
    },

    {
        id: 5,
        name: "Gel antibacterial",
        category: "Higiene personal",
        price: 55,
        oldPrice: 70,
        emoji: "🧴",
        discount: 21,
        badge: "Oferta",
        popular: true
    },

    {
        id: 6,
        name: "Protector solar FPS 50",
        category: "Cuidado de la piel",
        price: 189,
        oldPrice: 230,
        emoji: "☀️",
        discount: 18,
        badge: "Oferta",
        popular: true
    },

    {
        id: 7,
        name: "Ibuprofeno 400 mg",
        category: "Medicamentos",
        price: 75,
        oldPrice: 95,
        emoji: "💊",
        discount: 21,
        badge: "Oferta"
    },

    {
        id: 8,
        name: "Multivitamínico",
        category: "Vitaminas y suplementos",
        price: 210,
        oldPrice: 260,
        emoji: "💙",
        discount: 19,
        badge: "Oferta"
    },

    {
        id: 9,
        name: "Tensiómetro digital",
        category: "Equipo médico",
        price: 549,
        oldPrice: 699,
        emoji: "🩺",
        discount: 21,
        badge: "Oferta"
    },

    {
        id: 10,
        name: "Oxímetro de pulso",
        category: "Equipo médico",
        price: 329,
        oldPrice: 399,
        emoji: "🫀",
        discount: 18,
        badge: "Oferta"
    },

    {
        id: 11,
        name: "Kit de curación",
        category: "Primeros auxilios",
        price: 149,
        oldPrice: 190,
        emoji: "🩹",
        discount: 22,
        badge: "Oferta"
    },

    {
        id: 12,
        name: "Crema hidratante",
        category: "Cuidado de la piel",
        price: 135,
        oldPrice: 170,
        emoji: "🧴",
        discount: 21,
        badge: "Oferta"
    }

];



/* =========================================================
   ELEMENTOS
========================================================= */

const productGrid =
    document.getElementById("productGrid");

const seeAllProducts =
    document.getElementById("seeAllProducts");

const offersGrid =
    document.getElementById("offersGrid");

const searchInput =
    document.getElementById("storeSearch");

const searchBox =
    document.querySelector(".shop-search");

const searchToggle =
    document.querySelector(".search-toggle");

const cartCount =
    document.getElementById("cartCount");

const basketNumber =
    document.getElementById("basketNumber");

const basketItems =
    document.getElementById("basketItems");

const basketSubtotal =
    document.getElementById("basketSubtotal");

const basketSavings =
    document.getElementById("basketSavings");

const basketTotal =
    document.getElementById("basketTotal");

const accountButton =
    document.getElementById("accountButton");

const accountMenu =
    document.getElementById("accountMenu");

const notification =
    document.getElementById("cartNotification");

const notificationProduct =
    document.getElementById("notificationProduct");



/* =========================================================
   ESTADO
========================================================= */

let cart = JSON.parse(
    localStorage.getItem("cliniboxCart") || "[]"
);


let currentFilter = "Todos";

let expandedProducts = false;

function getFavorites() {

    return window.cliniboxFavorites.all();

}

function toggleFavorite(product) {

    return window.cliniboxFavorites.toggle(product);

}



/* =========================================================
   PRECIO
========================================================= */

function formatPrice(price) {

    return price.toLocaleString(
        "es-MX",
        {
            style: "currency",
            currency: "MXN"
        }
    );

}



/* =========================================================
   GUARDAR CARRITO
========================================================= */

function saveCart() {

    localStorage.setItem(
        "cliniboxCart",
        JSON.stringify(cart)
    );

}



/* =========================================================
   CONTADOR
========================================================= */

function updateCartCounter() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );

    if (cartCount) {

        cartCount.textContent = total;

    }

    if (basketNumber) {

        basketNumber.textContent = total;

    }

}



/* =========================================================
   AGREGAR AL CARRITO
========================================================= */

function addToCart(product) {

    window.cliniboxCart.add({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice || product.price,
        emoji: product.emoji,
        quantity: 1
    });

    cart = window.cliniboxCart.all();

    updateCartCounter();

    renderCart();

    showNotification(product.name);

}



/* =========================================================
   NOTIFICACIÓN
========================================================= */

function showNotification(name) {

    if (!notification) return;

    if (notificationProduct) {

        notificationProduct.textContent = name;

    }

    notification.classList.add("show");


    clearTimeout(
        window.cliniboxNotificationTimer
    );


    window.cliniboxNotificationTimer =
        setTimeout(
            () => {

                notification.classList.remove("show");

            },
            2200
        );

}



/* =========================================================
   RENDER OFERTAS
========================================================= */

function renderOffers() {

    if (!offersGrid) return;


    const offers =
        products
            .filter(
                product =>
                    product.discount > 0
            )
            .slice(0, 3);


    offersGrid.innerHTML = "";


    offers.forEach(
        (product, index) => {

            const card =
                document.createElement("article");


            card.className =
                "offer-card";


            if (index === 0) {

                card.classList.add(
                    "highlight"
                );

            }


            card.innerHTML = `

                <span class="offer-tag">

                    ${product.badge}

                </span>


                <button
                    class="offer-favorite"
                    type="button"
                    aria-label="Favorito"
                >

                    <i data-lucide="heart"></i>

                </button>


                <div class="offer-product-image">

                    ${product.emoji}

                </div>


                <h3 class="offer-name">

                    ${product.name}

                </h3>


                <p class="offer-description">

                    ${getProductDescription(product)}

                </p>

                <a
                    class="product-view-button"
                        href="${getProductDetailUrl(product)}"
                    aria-label="Ver ${product.name}"
                >

                    <i data-lucide="eye"></i>
                    Ver producto

                </a>


                <div class="offer-bottom">

                    <div class="offer-price">

                        <strong>

                            ${formatPrice(product.price)}

                        </strong>

                        <del>

                            ${formatPrice(product.oldPrice)}

                        </del>

                    </div>


                    <button
                        class="offer-cart"
                        type="button"
                        aria-label="Agregar al carrito"
                    >

                        <i data-lucide="shopping-cart"></i>

                    </button>

                </div>

            `;


            const addButton =
                card.querySelector(
                    ".offer-cart"
                );

            const favoriteButton =
                card.querySelector(".offer-favorite");

            const isFavorite =
                getFavorites().some(
                    item => String(item.id) === String(product.id)
                );

            favoriteButton.classList.toggle("active", isFavorite);
            favoriteButton.setAttribute("aria-pressed", String(isFavorite));
            favoriteButton.setAttribute(
                "aria-label",
                `${isFavorite ? "Quitar" : "Agregar"} ${product.name} ${isFavorite ? "de" : "a"} favoritos`
            );

            favoriteButton.addEventListener(
                "click",
                () => {

                    const added = toggleFavorite(product);

                    favoriteButton.classList.toggle("active", added);
                    favoriteButton.setAttribute("aria-pressed", String(added));
                    favoriteButton.setAttribute(
                        "aria-label",
                        `${added ? "Quitar" : "Agregar"} ${product.name} ${added ? "de" : "a"} favoritos`
                    );

                }
            );


            addButton.addEventListener(
                "click",
                () => {

                    addToCart(product);

                }
            );


            offersGrid.appendChild(card);

        }
    );


    if (
        typeof lucide !== "undefined"
        &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }

}



/* =========================================================
   DESCRIPCIONES
========================================================= */

function getProductDescription(product) {

    if (
        product.name.includes(
            "Paracetamol"
        )
    ) {

        return "20 tabletas";

    }


    if (
        product.name.includes(
            "Vitamina"
        )
    ) {

        return "60 cápsulas";

    }


    if (
        product.name.includes(
            "Termómetro"
        )
    ) {

        return "Precisión y rapidez";

    }


    if (
        product.name.includes(
            "Gasas"
        )
    ) {

        return "10 x 10 cm | 10 piezas";

    }


    return product.category;

}

function getProductDetailUrl(product) {

    const params = new URLSearchParams({
        id: String(product.id),
        nombre: product.name,
        categoria: product.category,
        precio: String(product.price),
        oldPrice: String(product.oldPrice || product.price),
        imagen: product.emoji || "💊",
        descripcion: getProductDescription(product)
    });

    return `/CLINIBOX/CLINIBOX/public/producto?${params.toString()}`;

}



/* =========================================================
   RENDER PRODUCTOS
========================================================= */

function renderProducts() {

    if (!productGrid) return;


    let filtered =
        [...products];


    if (
        currentFilter !== "Todos"
    ) {

        if (
            currentFilter === "Ofertas"
        ) {

            filtered =
                filtered.filter(
                    product =>
                        product.discount > 0
                );

        } else {

            filtered =
                filtered.filter(
                    product =>
                        product.category ===
                        currentFilter
                );

        }

    }


    const search =
        searchInput?.value
            ?.trim()
            .toLowerCase() || "";


    if (search) {

        filtered =
            filtered.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)
            );

    }


    /*
       SI NO HAY BÚSQUEDA:
       MOSTRAMOS LOS MÁS BUSCADOS
    */

    if (
        !search
        &&
        currentFilter === "Todos"
    ) {

        filtered =
            filtered.filter(
                product =>
                    product.popular
            );

    }


    if (seeAllProducts) {

        seeAllProducts.style.display =
            filtered.length > 4
                ? "flex"
                : "none";

        seeAllProducts.setAttribute(
            "aria-expanded",
            String(expandedProducts)
        );

        seeAllProducts.innerHTML = expandedProducts
            ? 'Ver menos <i data-lucide="arrow-up"></i>'
            : 'Ver todos <i data-lucide="arrow-right"></i>';

    }


    productGrid.innerHTML = "";


    if (!filtered.length) {

        productGrid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    padding:35px;
                    text-align:center;
                    color:#55758e;
                "
            >

                <strong>
                    No encontramos productos
                </strong>

                <br>

                <small>
                    Intenta con otro nombre o categoría.
                </small>

            </div>

        `;

        return;

    }


    (expandedProducts ? filtered : filtered.slice(0, 4))
        .forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "popular-product";


                card.innerHTML = `

                    <div class="popular-product-image">

                        <button
                            class="popular-favorite"
                            type="button">

                            <i data-lucide="heart"></i>

                        </button>

                        ${product.emoji}

                    </div>


                    <div
                        class="popular-product-name"
                        title="${product.name}"
                    >

                        ${product.name}

                    </div>


                    <div class="popular-product-detail">

                        ${getProductDescription(product)}

                    </div>

                    <a
                        class="product-view-button"
                        href="${getProductDetailUrl(product)}"
                        aria-label="Ver ${product.name}"
                    >

                        <i data-lucide="eye"></i>
                        Ver producto

                    </a>


                    <div class="popular-product-bottom">

                        <div class="popular-product-prices">

                            <strong class="popular-product-price">
                                ${formatPrice(product.price)}
                            </strong>

                            ${product.oldPrice > product.price
                                ? `<del class="popular-product-old-price">${formatPrice(product.oldPrice)}</del>`
                                : ""}

                        </div>


                        <button
                            class="popular-add"
                            type="button"
                            aria-label="Agregar al carrito"
                        >

                            <i data-lucide="shopping-cart"></i>

                        </button>

                    </div>

                `;


                card.querySelector(
                    ".popular-add"
                ).addEventListener(
                    "click",
                    () => {

                        addToCart(product);

                    }
                );

                const favoriteButton =
                    card.querySelector(".popular-favorite");

                const isFavorite =
                    getFavorites().some(
                        item => String(item.id) === String(product.id)
                    );

                favoriteButton.classList.toggle("active", isFavorite);
                favoriteButton.setAttribute("aria-pressed", String(isFavorite));
                favoriteButton.setAttribute(
                    "aria-label",
                    `${isFavorite ? "Quitar" : "Agregar"} ${product.name} ${isFavorite ? "de" : "a"} favoritos`
                );

                favoriteButton.addEventListener(
                    "click",
                    () => {

                        const added = toggleFavorite(product);

                        favoriteButton.classList.toggle("active", added);
                        favoriteButton.setAttribute("aria-pressed", String(added));
                        favoriteButton.setAttribute(
                            "aria-label",
                            `${added ? "Quitar" : "Agregar"} ${product.name} ${added ? "de" : "a"} favoritos`
                        );

                    }
                );


                productGrid.appendChild(card);

            }
        );


    if (
        typeof lucide !== "undefined"
        &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }

}



/* =========================================================
   CARRITO
========================================================= */

function renderCart() {

    if (!basketItems) return;


    if (!cart.length) {

        basketItems.innerHTML = `

            <div class="empty-basket">

                <i data-lucide="shopping-bag"></i>

                <strong>
                    Tu canasta está vacía
                </strong>

                <span>
                    Agrega productos para verlos aquí.
                </span>

            </div>

        `;

        if (
            typeof lucide !== "undefined"
            &&
            lucide.createIcons
        ) {

            lucide.createIcons();

        }

        updateTotals();

        return;

    }


    basketItems.innerHTML = "";


    cart.forEach(
        item => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "basket-item";


            row.innerHTML = `

                <div class="basket-product-image">

                    ${item.emoji || "💊"}

                </div>


                <div class="basket-product-info">

                    <strong>

                        ${item.name}

                    </strong>

                    <span>

                        ${item.category}

                    </span>


                    <div class="basket-quantity">

                        <button
                            class="quantity-button decrease"
                            type="button"
                        >

                            −

                        </button>


                        <span>

                            ${item.quantity}

                        </span>


                        <button
                            class="quantity-button increase"
                            type="button"
                        >

                            +

                        </button>

                    </div>

                </div>


                <strong
                    class="basket-product-price"
                >

                    ${formatPrice(
                        item.price *
                        item.quantity
                    )}

                </strong>

            `;


            row.querySelector(
                ".decrease"
            ).addEventListener(
                "click",
                () => {

                    changeQuantity(
                        item.id,
                        -1
                    );

                }
            );


            row.querySelector(
                ".increase"
            ).addEventListener(
                "click",
                () => {

                    changeQuantity(
                        item.id,
                        1
                    );

                }
            );


            basketItems.appendChild(row);

        }
    );


    updateTotals();

}



/* =========================================================
   CAMBIAR CANTIDAD
========================================================= */

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            product =>
                String(product.id) ===
                String(id)
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    String(product.id) !==
                    String(id)
            );

    }


    saveCart();

    updateCartCounter();

    renderCart();

}



/* =========================================================
   TOTALES
========================================================= */

function updateTotals() {

    let subtotal = 0;

    let savings = 0;


    cart.forEach(
        item => {

            subtotal +=
                item.price *
                item.quantity;


            savings +=
                (
                    (item.oldPrice || item.price)
                    -
                    item.price
                )
                *
                item.quantity;

        }
    );


    const total =
        subtotal;


    if (basketSubtotal) {

        basketSubtotal.textContent =
            formatPrice(subtotal);

    }


    if (basketSavings) {

        basketSavings.textContent =
            formatPrice(savings);

    }


    if (basketTotal) {

        basketTotal.textContent =
            formatPrice(total);

    }

}



/* =========================================================
   FILTROS
========================================================= */

document
    .querySelectorAll(".quick-filter")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".quick-filter"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderProducts();

                }
            );

        }
    );



/* =========================================================
   BÚSQUEDA
========================================================= */

if (searchInput) {

    const closeSearch = () => {

        searchBox?.classList.remove("is-open");
        searchToggle?.setAttribute("aria-expanded", "false");

    };

    searchToggle?.addEventListener("click", () => {

        const isOpen =
            searchBox?.classList.toggle("is-open");

        searchToggle.setAttribute(
            "aria-expanded",
            String(Boolean(isOpen))
        );

        if (isOpen) searchInput.focus();

    });

    document.addEventListener("click", event => {

        if (
            searchBox?.classList.contains("is-open")
            &&
            !searchBox.contains(event.target)
        ) {

            closeSearch();

        }

    });

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSearch();
            searchToggle?.focus();

        }

    });

    searchInput.addEventListener(
        "input",
        () => {

            currentFilter =
                "Todos";


            document
                .querySelectorAll(
                    ".quick-filter"
                )
                .forEach(
                    item => {

                        item.classList.toggle(
                            "active",
                            item.dataset.filter ===
                            "Todos"
                        );

                    }
                );


            renderProducts();

        }
    );

}



/* =========================================================
   VER TODOS
========================================================= */

if (seeAllProducts) {

    seeAllProducts.addEventListener(
        "click",
        () => {

            expandedProducts = !expandedProducts;
            renderProducts();

        }
    );

}



/* =========================================================
   CUENTA
========================================================= */

if (accountButton) {

    accountButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            accountMenu.classList.toggle(
                "show"
            );

        }
    );

}


document.addEventListener(
    "click",
    event => {

        if (
            accountMenu
            &&
            !accountMenu.contains(event.target)
            &&
            event.target !== accountButton
        ) {

            accountMenu.classList.remove(
                "show"
            );

        }

    }
);



/* =========================================================
   FLECHAS DE OFERTAS
========================================================= */

const offerNext =
    document.getElementById(
        "offerNext"
    );

const offerPrev =
    document.getElementById(
        "offerPrev"
    );


if (offerNext) {

    offerNext.addEventListener(
        "click",
        () => {

            if (!offersGrid) return;

            offersGrid.scrollBy({

                left:
                    offersGrid.clientWidth * .8,

                behavior: "smooth"

            });

        }
    );

}


if (offerPrev) {

    offerPrev.addEventListener(
        "click",
        () => {

            if (!offersGrid) return;

            offersGrid.scrollBy({

                left:
                    -offersGrid.clientWidth * .8,

                behavior: "smooth"

            });

        }
    );

}



/* =========================================================
   INICIALIZAR
========================================================= */

renderOffers();

renderProducts();

renderCart();

updateCartCounter();


if (
    typeof lucide !== "undefined"
    &&
    lucide.createIcons
) {

    lucide.createIcons();

}