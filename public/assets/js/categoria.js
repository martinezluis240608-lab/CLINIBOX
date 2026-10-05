/* =====================================================
   CLINIBOX
   SISTEMA DE CATEGORÍAS
===================================================== */


/* =====================================================
   CATEGORÍA SELECCIONADA
===================================================== */

const params = new URLSearchParams(
    window.location.search
);

const categoriaURL =
    params.get("categoria");


/* =====================================================
   CATEGORÍA ACTIVA EN EL SIDEBAR
===================================================== */

document
    .querySelectorAll(".shop-category")
    .forEach(link => {

        link.classList.remove("active");

        if (
            link.dataset.category === categoriaURL
        ) {

            link.classList.add("active");

        }

    });


/*
   Convertimos el nombre recibido
   a un nombre bonito.
*/

const categorias = {

    "medicamentos": {
        nombre: "Medicamentos",
        icono: "pill",
        descripcion:
            "Encuentra los productos que necesitas para cuidar de tu salud."
    },

    "cuidado-personal": {
        nombre: "Cuidado personal",
        icono: "sparkles",
        descripcion:
            "Productos para tu cuidado diario y bienestar."
    },

    "primeros-auxilios": {
        nombre: "Primeros auxilios",
        icono: "cross",
        descripcion:
            "Todo lo necesario para tener a la mano cuando más lo necesitas."
    },

    "salud-y-bienestar": {
        nombre: "Salud y bienestar",
        icono: "heart-pulse",
        descripcion:
            "Productos para acompañar tus hábitos y bienestar."
    },

    "salud-bienestar": {
        nombre: "Salud y bienestar",
        icono: "heart-pulse",
        descripcion:
            "Productos para acompañar tus hábitos y bienestar."
    },

    "dermatologia": {
        nombre: "Dermatología",
        icono: "sun",
        descripcion:
            "Productos seleccionados para el cuidado de tu piel."
    },

    "salud-emocional": {
        nombre: "Salud emocional",
        icono: "brain",
        descripcion:
            "Productos y recursos para acompañar tu bienestar."
    },

    "diabetes": {
        nombre: "Diabetes",
        icono: "droplet",
        descripcion:
            "Productos para apoyar el cuidado y monitoreo diario."
    },

    "nutricion": {
        nombre: "Nutrición",
        icono: "apple",
        descripcion:
            "Opciones para acompañar una alimentación equilibrada."
    },

    "equipo-medico": {
        nombre: "Equipo médico",
        icono: "stethoscope",
        descripcion:
            "Equipo práctico para monitoreo y cuidado en casa."
    }

};


/* =====================================================
   SI NO EXISTE CATEGORÍA
===================================================== */

const categoria =
    categorias[categoriaURL] ||
    categorias["medicamentos"];

function getCategoryFavoriteId(producto) {

    const slug = producto.nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `${producto.categoryKey || categoriaURL || "medicamentos"}:${slug}`;

}

function getCategoryFavorites() {

    return window.cliniboxFavorites.all();

}

function toggleCategoryFavorite(producto) {

    return window.cliniboxFavorites.toggle({
        id: getCategoryFavoriteId(producto),
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        categoria: producto.categoryName || categoria.nombre,
        oldPrice: producto.anterior || producto.precio
    });

}

function getCategoryProductDetailUrl(producto) {

    const params = new URLSearchParams({
        id: getCategoryFavoriteId(producto),
        nombre: producto.nombre,
        categoria: producto.categoryName || categoria.nombre,
        precio: String(producto.precio),
        oldPrice: String(producto.anterior || producto.precio),
        imagen: producto.imagen || "💊",
        descripcion: getCategoryProductDescription(producto)
    });

    return `/CLINIBOX/CLINIBOX/public/producto?${params.toString()}`;

}


/* =====================================================
   PRODUCTOS DE EJEMPLO
===================================================== */

const productos = {

    "medicamentos": [

        {
            nombre: "Paracetamol 500 mg",
            precio: 65,
            anterior: 79,
            imagen: "💊",
            oferta: true,
            popular: true
        },

        {
            nombre: "Ibuprofeno 200 mg",
            precio: 92,
            anterior: null,
            imagen: "💊",
            oferta: false,
            popular: true
        },

        {
            nombre: "Analgésico de uso general",
            precio: 89,
            anterior: null,
            imagen: "💊",
            oferta: false,
            popular: false
        },

        {
            nombre: "Vitaminas diarias",
            precio: 149,
            anterior: 179,
            imagen: "🧴",
            oferta: true,
            popular: true
        }

    ],


    "cuidado-personal": [

        {
            nombre: "Gel antibacterial",
            precio: 59,
            anterior: null,
            imagen: "🧴",
            oferta: false,
            popular: true
        },

        {
            nombre: "Crema hidratante",
            precio: 129,
            anterior: 159,
            imagen: "🧴",
            oferta: true,
            popular: true
        },

        {
            nombre: "Protector labial",
            precio: 49,
            anterior: null,
            imagen: "💄",
            oferta: false,
            popular: false
        },

        {
            nombre: "Jabón dermatológico",
            precio: 89,
            anterior: 109,
            imagen: "🧼",
            oferta: true,
            popular: true
        }

    ],


    "primeros-auxilios": [

        {
            nombre: "Kit de primeros auxilios",
            precio: 349,
            anterior: null,
            imagen: "🩹",
            oferta: false,
            popular: true
        },

        {
            nombre: "Curitas adhesivas",
            precio: 45,
            anterior: 59,
            imagen: "🩹",
            oferta: true,
            popular: true
        },

        {
            nombre: "Gasas estériles",
            precio: 75,
            anterior: null,
            imagen: "🩹",
            oferta: false,
            popular: false
        },

        {
            nombre: "Venda elástica",
            precio: 95,
            anterior: 119,
            imagen: "🩹",
            oferta: true,
            popular: true
        }

    ],


    "salud-y-bienestar": [

        {
            nombre: "Monitor de salud",
            precio: 399,
            anterior: 499,
            imagen: "❤️",
            oferta: true,
            popular: true
        },

        {
            nombre: "Termómetro digital",
            precio: 249,
            anterior: null,
            imagen: "🌡️",
            oferta: false,
            popular: true
        },

        {
            nombre: "Organizador semanal",
            precio: 119,
            anterior: 139,
            imagen: "📋",
            oferta: true,
            popular: false
        },

        {
            nombre: "Almohada terapéutica",
            precio: 299,
            anterior: null,
            imagen: "💙",
            oferta: false,
            popular: true
        }

    ],


    "dermatologia": [

        {
            nombre: "Protector solar FPS 50",
            precio: 289,
            anterior: 349,
            imagen: "☀️",
            oferta: true,
            popular: true
        },

        {
            nombre: "Crema facial hidratante",
            precio: 219,
            anterior: null,
            imagen: "🧴",
            oferta: false,
            popular: true
        },

        {
            nombre: "Gel limpiador facial",
            precio: 179,
            anterior: 209,
            imagen: "🫧",
            oferta: true,
            popular: false
        },

        {
            nombre: "Crema corporal",
            precio: 159,
            anterior: null,
            imagen: "🧴",
            oferta: false,
            popular: true
        }

    ],


    "salud-emocional": [

        {
            nombre: "Diario de bienestar",
            precio: 129,
            anterior: null,
            imagen: "📓",
            oferta: false,
            popular: true
        },

        {
            nombre: "Agenda de hábitos",
            precio: 159,
            anterior: 189,
            imagen: "📔",
            oferta: true,
            popular: true
        },

        {
            nombre: "Kit de relajación",
            precio: 249,
            anterior: null,
            imagen: "🧘",
            oferta: false,
            popular: false
        },

        {
            nombre: "Antifaz de descanso",
            precio: 99,
            anterior: 119,
            imagen: "😴",
            oferta: true,
            popular: true
        }

    ],


    "diabetes": [

        {
            nombre: "Medidor de glucosa",
            precio: 499,
            anterior: 599,
            imagen: "🩸",
            oferta: true,
            popular: true
        },

        {
            nombre: "Tiras reactivas",
            precio: 289,
            anterior: null,
            imagen: "🧪",
            oferta: false,
            popular: true
        },

        {
            nombre: "Lancetas",
            precio: 149,
            anterior: 169,
            imagen: "🔹",
            oferta: true,
            popular: false
        },

        {
            nombre: "Estuche para glucómetro",
            precio: 179,
            anterior: null,
            imagen: "🧰",
            oferta: false,
            popular: true
        }

    ]

};


const descripcionesProductos = {
    "Paracetamol 500 mg": "Presentación en tabletas para integrar al botiquín de casa.",
    "Ibuprofeno 200 mg": "Tabletas en presentación de 200 mg para el botiquín.",
    "Analgésico de uso general": "Opción de uso general para tener a mano en casa.",
    "Vitaminas diarias": "Complemento en presentación práctica para la rutina diaria.",
    "Gel antibacterial": "Gel para la higiene cotidiana de manos.",
    "Crema hidratante": "Crema de uso diario para el cuidado de la piel.",
    "Protector labial": "Bálsamo práctico para el cuidado diario de los labios.",
    "Jabón dermatológico": "Jabón para la higiene diaria de la piel.",
    "Kit de primeros auxilios": "Elementos básicos organizados para atender curaciones en casa.",
    "Curitas adhesivas": "Tiras adhesivas para proteger pequeñas curaciones.",
    "Gasas estériles": "Gasas para limpieza y cobertura de curaciones.",
    "Venda elástica": "Venda flexible para sujeción y soporte.",
    "Monitor de salud": "Dispositivo para consultar indicadores de salud en casa.",
    "Termómetro digital": "Termómetro digital para consultar la temperatura corporal.",
    "Organizador semanal": "Organizador con espacios para planificar la semana.",
    "Almohada terapéutica": "Almohada de apoyo para descansar con comodidad.",
    "Protector solar FPS 50": "Protector solar FPS 50 para el cuidado diario al aire libre.",
    "Crema facial hidratante": "Crema de uso facial para la rutina diaria de cuidado.",
    "Gel limpiador facial": "Gel para limpiar el rostro como parte de la rutina diaria.",
    "Crema corporal": "Crema para aplicar en la rutina diaria de cuidado corporal.",
    "Diario de bienestar": "Cuaderno para registrar hábitos y notas personales.",
    "Agenda de hábitos": "Agenda para organizar y dar seguimiento a hábitos cotidianos.",
    "Kit de relajación": "Accesorios seleccionados para acompañar momentos de descanso.",
    "Antifaz de descanso": "Antifaz suave para reducir la luz durante el descanso.",
    "Medidor de glucosa": "Medidor para registrar niveles de glucosa en casa.",
    "Tiras reactivas": "Tiras compatibles para realizar mediciones con un glucómetro.",
    "Lancetas": "Lancetas para utilizar con dispositivos de punción compatibles.",
    "Estuche para glucómetro": "Estuche para guardar y transportar un glucómetro y sus accesorios."
};

function getCategoryProductDescription(producto) {

    return producto.descripcion
        || descripcionesProductos[producto.nombre]
        || `Información de ${producto.nombre}.`;

}


/* =====================================================
   OBTENER PRODUCTOS
===================================================== */

let listaProductos =
    productos[categoriaURL] ||
    productos["medicamentos"];

const todosLosProductos =
    Object.entries(productos).flatMap(
        ([categoryKey, categoryProducts]) =>
            categoryProducts.map(producto => ({
                ...producto,
                categoryKey,
                categoryName: categorias[categoryKey]?.nombre || categoryKey
            }))
    );



/* =====================================================
   ELEMENTOS
===================================================== */

const title =
    document.getElementById(
        "categoryTitle"
    );

const description =
    document.getElementById(
        "categoryDescription"
    );

const count =
    document.getElementById(
        "categoryProductCount"
    );

const grid =
    document.getElementById(
        "productsGrid"
    );

const storeSearch =
    document.getElementById(
        "storeSearch"
    );

const searchBox =
    document.querySelector(".shop-search");

const searchToggle =
    document.querySelector(".search-toggle");

const resultCount =
    document.getElementById(
        "resultCount"
    );

const sort =
    document.getElementById(
        "categorySort"
    );

const empty =
    document.getElementById(
        "emptyProducts"
    );


let filtroActual = "todos";

let textoBusqueda = "";



/* =====================================================
   DATOS DE CATEGORÍA
===================================================== */

title.textContent =
    categoria.nombre;

description.textContent =
    categoria.descripcion;

count.textContent =
    listaProductos.length;



/* =====================================================
   FILTROS
===================================================== */

document
    .querySelectorAll(".category-filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".category-filter"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                filtroActual =
                    button.dataset.filter;


                renderProductos();

            }

        );

    });



/* =====================================================
   BUSQUEDA GLOBAL DESDE EL ENCABEZADO
===================================================== */

if (searchToggle && storeSearch && searchBox) {

    const closeSearch = () => {

        searchBox.classList.remove("is-open");
        searchToggle.setAttribute("aria-expanded", "false");

    };

    searchToggle.addEventListener("click", event => {

        event.stopPropagation();

        const isOpen = searchBox.classList.toggle("is-open");
        searchToggle.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) storeSearch.focus();

    });

    storeSearch.addEventListener("input", event => {

        textoBusqueda = event.target.value.toLowerCase().trim();
        renderProductos();

    });

    storeSearch.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeSearch();
            searchToggle.focus();

        }

    });

    document.addEventListener("click", event => {

        if (!searchBox.contains(event.target)) closeSearch();

    });

}



/* =====================================================
   ORDENAR
===================================================== */

sort.addEventListener(
    "change",
    renderProductos
);



/* =====================================================
   RENDERIZAR
===================================================== */

function renderProductos() {

    let resultados =
        [...(textoBusqueda ? todosLosProductos : listaProductos)];


    /* FILTRO */

    if (
        filtroActual ===
        "ofertas"
    ) {

        resultados =
            resultados.filter(
                producto =>
                    producto.oferta
            );

    }


    if (
        filtroActual ===
        "populares"
    ) {

        resultados =
            resultados.filter(
                producto =>
                    producto.popular
            );

    }


    /* BUSQUEDA */

    if (textoBusqueda) {

        resultados =
            resultados.filter(
                producto => {

                    const categoryName =
                        producto.categoryName
                        || categoria.nombre;

                    return `${producto.nombre} ${categoryName}`
                        .toLowerCase()
                        .includes(textoBusqueda);

                }
            );

    }


    /* ORDEN */

    switch (sort.value) {

        case "precio-menor":

            resultados.sort(
                (a, b) =>
                    a.precio - b.precio
            );

            break;


        case "precio-mayor":

            resultados.sort(
                (a, b) =>
                    b.precio - a.precio
            );

            break;


        case "nombre":

            resultados.sort(
                (a, b) =>
                    a.nombre.localeCompare(
                        b.nombre,
                        "es"
                    )
            );

            break;

    }



    /* CONTADORES */

    title.textContent = textoBusqueda
        ? "Resultados de búsqueda"
        : categoria.nombre;

    description.textContent = textoBusqueda
        ? `Resultados para “${textoBusqueda}” en todas las categorías.`
        : categoria.descripcion;

    count.textContent = textoBusqueda
        ? resultados.length
        : listaProductos.length;

    resultCount.textContent =
        `${resultados.length} ${
            resultados.length === 1
                ? "producto"
                : "productos"
        }`;


    /* LIMPIAR */

    grid.innerHTML = "";


    /* SIN RESULTADOS */

    if (!resultados.length) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";



    /* CREAR TARJETAS */

    resultados.forEach(
        (producto, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "category-product-card";


            card.style.animationDelay =
                `${index * 60}ms`;


            card.innerHTML = `

                <div
                    class="category-product-image">

                    <button
                        class="category-favorite-button"
                        type="button">

                        <i data-lucide="heart"></i>

                    </button>

                    ${
                        producto.oferta
                        ?
                        `
                        <span class="product-badge offer">
                            Oferta
                        </span>
                        `
                        :
                        ""
                    }


                    <span>
                        ${producto.imagen}
                    </span>

                </div>


                <div
                    class="category-product-info">

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p class="category-product-description">
                        ${getCategoryProductDescription(producto)}
                    </p>

                    <a
                        class="category-product-view"
                        href="${getCategoryProductDetailUrl(producto)}"
                    >

                        <i data-lucide="eye"></i>
                        Ver producto

                    </a>


                    <div
                        class="category-price">

                        <strong>
                            $${producto.precio.toFixed(2)}
                        </strong>

                        ${
                            producto.anterior
                            ?
                            `
                            <del>
                                $${producto.anterior.toFixed(2)}
                            </del>
                            `
                            :
                            ""
                        }

                    </div>


                    <button
                        class="category-add-cart"
                        type="button"
                        aria-label="Agregar ${producto.nombre} al carrito"
                        title="Agregar ${producto.nombre} al carrito">

                        <i data-lucide="shopping-cart" aria-hidden="true"></i>

                    </button>

                </div>

            `;


            const button =
                card.querySelector(
                    ".category-add-cart"
                );

            const favoriteButton =
                card.querySelector(".category-favorite-button");

            const productId =
                getCategoryFavoriteId(producto);

            const isFavorite =
                getCategoryFavorites().some(
                    item => String(item.id) === productId
                );

            favoriteButton.classList.toggle("active", isFavorite);
            favoriteButton.setAttribute("aria-pressed", String(isFavorite));
            favoriteButton.setAttribute(
                "aria-label",
                `${isFavorite ? "Quitar" : "Agregar"} ${producto.nombre} ${isFavorite ? "de" : "a"} favoritos`
            );

            favoriteButton.addEventListener(
                "click",
                () => {

                    const added = toggleCategoryFavorite(producto);

                    favoriteButton.classList.toggle("active", added);
                    favoriteButton.setAttribute("aria-pressed", String(added));
                    favoriteButton.setAttribute(
                        "aria-label",
                        `${added ? "Quitar" : "Agregar"} ${producto.nombre} ${added ? "de" : "a"} favoritos`
                    );

                }
            );


            button.addEventListener(
                "click",
                () => {

                    agregarCarrito(
                        producto
                    );


                    button.classList.add(
                        "added"
                    );

                    button.innerHTML =
                        '<i data-lucide="check" aria-hidden="true"></i>';

                    button.setAttribute(
                        "aria-label",
                        `${producto.nombre} agregado al carrito`
                    );


                    lucide.createIcons();


                    setTimeout(
                        () => {

                            button.classList.remove(
                                "added"
                            );


                            button.innerHTML =
                                '<i data-lucide="shopping-cart" aria-hidden="true"></i>';

                            button.setAttribute(
                                "aria-label",
                                `Agregar ${producto.nombre} al carrito`
                            );


                            lucide.createIcons();

                        },
                        1200
                    );

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    lucide.createIcons();

}



/* =====================================================
   CARRITO
===================================================== */

function agregarCarrito(producto) {

    window.cliniboxCart.add({
        id: getCategoryFavoriteId(producto),
        name: producto.nombre,
        category: categoria.nombre,
        price: producto.precio,
        oldPrice: producto.anterior || producto.precio,
        emoji: producto.imagen,
        quantity: 1
    });

}



/* =====================================================
   CONTADOR CARRITO
===================================================== */

function actualizarContadorCarrito() {

    const carrito =
        JSON.parse(
            localStorage.getItem(
                "cliniboxCart"
            ) || "[]"
        );


    const total =
        carrito.reduce(
            (suma, producto) =>
                suma +
                Number(producto.quantity || producto.cantidad || 0),
            0
        );


    const contador = document.getElementById("cartCount");

    if (contador) {

        contador.textContent = total;

    }

}



/* =====================================================
   BOTON MOSTRAR TODOS
===================================================== */

document
    .getElementById(
        "btnMostrarTodos"
    )
    .addEventListener(
        "click",
        () => {

            storeSearch.value = "";

            textoBusqueda = "";

            filtroActual = "todos";

            document
                .querySelectorAll(
                    ".category-filter"
                )
                .forEach(btn => {

                    btn.classList.toggle(
                        "active",
                        btn.dataset.filter ===
                        "todos"
                    );

                });

            renderProductos();

        }
    );



/* =====================================================
   INICIAR
===================================================== */

actualizarContadorCarrito();

renderProductos();