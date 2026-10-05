(() => {

/* ==========================================================
   CLINIBOX - FAVORITOS
   Comparte favoritos y carrito con toda la tienda.
========================================================== */


/* ==========================================================
   CLAVES DE LOCALSTORAGE
========================================================== */

const FAVORITOS_KEY =
    "cliniboxFavoritos";

const CARRITO_KEY =
    "cliniboxCart";


/* ==========================================================
   OBTENER FAVORITOS
========================================================== */

function obtenerFavoritos() {

    try {

        return JSON.parse(
            localStorage.getItem(
                FAVORITOS_KEY
            ) || "[]"
        );

    } catch (error) {

        console.error(
            "Error leyendo favoritos:",
            error
        );

        return [];

    }

}


/* ==========================================================
   GUARDAR FAVORITOS
========================================================== */

function guardarFavoritos(
    favoritos
) {

    localStorage.setItem(
        FAVORITOS_KEY,
        JSON.stringify(favoritos)
    );


    /*
       Este evento actualiza la página
       inmediatamente.
    */

    window.dispatchEvent(
        new CustomEvent(
            "clinibox:favoritos"
        )
    );

}


/* ==========================================================
   SABER SI ES FAVORITO
========================================================== */

function esFavorito(id) {

    return obtenerFavoritos().some(
        producto =>
            String(producto.id) ===
            String(id)
    );

}


/* ==========================================================
   AGREGAR / QUITAR FAVORITO
========================================================== */

function alternarFavorito(
    producto
) {

    let favoritos =
        obtenerFavoritos();


    const indice =
        favoritos.findIndex(
            item =>
                String(item.id) ===
                String(producto.id)
        );


    if (indice !== -1) {

        favoritos.splice(
            indice,
            1
        );

    } else {

        favoritos.push({

            id: producto.id,

            nombre:
                producto.nombre ||
                producto.name ||
                "Producto",

            precio:
                Number(
                    producto.precio ||
                    producto.price ||
                    0
                ),

            imagen:
                producto.imagen ||
                producto.emoji ||
                "💊",

            categoria:
                producto.categoria ||
                producto.category ||
                "Producto de salud",

            oldPrice:
                Number(
                    producto.oldPrice ||
                    producto.precio ||
                    producto.price ||
                    0
                )

        });

    }


    guardarFavoritos(
        favoritos
    );


    actualizarContadorFavoritos();

    renderizarFavoritos();


    return indice === -1;

}


/* ==========================================================
   CONTADOR DE FAVORITOS
========================================================== */

function actualizarContadorFavoritos() {

    const contador =
        document.getElementById(
            "favoriteCount"
        );


    if (!contador) return;


    contador.textContent =
        obtenerFavoritos().length;

}


/* ==========================================================
   CONTADOR DEL CARRITO
========================================================== */

function actualizarContadorCarrito() {

    const contador =
        document.getElementById(
            "cartCount"
        );


    if (!contador) return;


    const carrito =
        obtenerCarrito();


    const cantidad =
        carrito.reduce(
            (
                total,
                item
            ) => {

                return total +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );


    contador.textContent =
        cantidad;

}


/* ==========================================================
   OBTENER CARRITO
========================================================== */

function obtenerCarrito() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CARRITO_KEY
            ) || "[]"
        );

    } catch (error) {

        return [];

    }

}


/* ==========================================================
   GUARDAR CARRITO
========================================================== */

function guardarCarrito(
    carrito
) {

    localStorage.setItem(
        CARRITO_KEY,
        JSON.stringify(carrito)
    );


    actualizarContadorCarrito();

}


/* ==========================================================
   AGREGAR FAVORITO AL CARRITO
========================================================== */

function agregarFavoritoAlCarrito(
    producto
) {

    let carrito =
        obtenerCarrito();


    const existente =
        carrito.find(
            item =>
                String(item.id) ===
                String(producto.id)
        );


    if (existente) {

        existente.quantity =
            Number(
                existente.quantity || 1
            ) + 1;

    } else {

        carrito.push({

            id: producto.id,

            name:
                producto.nombre ||
                "Producto",

            category:
                producto.categoria ||
                "Producto de salud",

            price:
                Number(
                    producto.precio || 0
                ),

            oldPrice:
                Number(
                    producto.oldPrice ||
                    producto.precio ||
                    0
                ),

            emoji:
                producto.imagen ||
                "💊",

            quantity: 1

        });

    }


    guardarCarrito(
        carrito
    );


    mostrarNotificacionCarrito(
        producto.nombre
    );

}


/* ==========================================================
   NOTIFICACIÓN
========================================================== */

function mostrarNotificacionCarrito(
    nombre
) {

    /*
       Usamos una notificación sencilla
       sin modificar los botones originales.
    */

    let notification =
        document.getElementById(
            "favoriteCartNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "favoriteCartNotification";


        notification.className =
            "favorite-cart-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.innerHTML = `

        <i data-lucide="check-circle"></i>

        <span>
            ${nombre} agregado al carrito
        </span>

    `;


    notification.classList.add(
        "show"
    );


    if (
        typeof lucide !== "undefined" &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }


    clearTimeout(
        window.favoriteNotificationTimer
    );


    window.favoriteNotificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* ==========================================================
   RENDERIZAR FAVORITOS
========================================================== */

function renderizarFavoritos() {

    const grid =
        document.getElementById(
            "favoritesGrid"
        );


    const vacio =
        document.getElementById(
            "favoritesEmpty"
        );


    if (!grid) return;


    const favoritos =
        obtenerFavoritos();


    grid.innerHTML = "";


    /*
       SI NO HAY FAVORITOS
    */

    if (
        favoritos.length === 0
    ) {

        if (vacio) {

            vacio.style.display =
                "block";

        }


        actualizarContadorFavoritos();

        return;

    }


    /*
       SI HAY FAVORITOS
    */

    if (vacio) {

        vacio.style.display =
            "none";

    }


    favoritos.forEach(
        producto => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "favorite-card";


            const imagen =
                producto.imagen
                    ? producto.imagen
                    : "💊";


            card.innerHTML = `

                <div class="favorite-card-image">

                    <span>

                        ${imagen}

                    </span>

                </div>


                <div class="favorite-card-info">


                    <small>

                        ${
                            producto.categoria ||
                            "Producto de salud"
                        }

                    </small>


                    <h3>

                        ${producto.nombre}

                    </h3>


                    <div class="favorite-card-price">

                        $${Number(
                            producto.precio
                        ).toFixed(2)}

                    </div>


                    <div class="favorite-card-actions">


                        <!-- AGREGAR AL CARRITO -->

                        <button
                            class="favorite-add-cart"
                            type="button"
                            data-id="${producto.id}"
                        >

                            <i data-lucide="shopping-cart"></i>

                            Agregar al carrito

                        </button>


                        <!-- QUITAR FAVORITO -->

                        <button
                            class="favorite-remove"
                            type="button"
                            data-id="${producto.id}"
                        >

                            <i data-lucide="heart-off"></i>

                            Quitar

                        </button>


                    </div>

                </div>

            `;


            grid.appendChild(
                card
            );

        }
    );


    /*
       BOTONES AGREGAR AL CARRITO
    */

    grid
        .querySelectorAll(
            ".favorite-add-cart"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.id;


                        const producto =
                            obtenerFavoritos()
                                .find(
                                    item =>
                                        String(
                                            item.id
                                        ) ===
                                        String(id)
                                );


                        if (!producto) return;


                        agregarFavoritoAlCarrito(
                            producto
                        );

                    }
                );

            }
        );


    /*
       BOTONES QUITAR
    */

    grid
        .querySelectorAll(
            ".favorite-remove"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.id;


                        quitarFavorito(
                            id
                        );

                    }
                );

            }
        );


    actualizarContadorFavoritos();


    if (
        typeof lucide !== "undefined" &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }

}


/* ==========================================================
   QUITAR FAVORITO
========================================================== */

function quitarFavorito(
    id
) {

    const favoritos =
        obtenerFavoritos().filter(
            producto =>
                String(producto.id) !==
                String(id)
        );


    guardarFavoritos(
        favoritos
    );


    renderizarFavoritos();

    actualizarContadorFavoritos();

}


/* ==========================================================
   BOTÓN FAVORITOS
========================================================== */

const favoritesButton =
    document.getElementById(
        "favoritesButton"
    );


if (favoritesButton) {

    favoritesButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "/CLINIBOX/CLINIBOX/public/favoritos";

        }
    );

}


/* ==========================================================
   BOTÓN CARRITO
========================================================== */

const cartButton =
    document.getElementById(
        "cartButton"
    );


if (cartButton) {

    cartButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "/CLINIBOX/CLINIBOX/public/carrito";

        }
    );

}


/* ==========================================================
   CAMBIOS DESDE OTRA PESTAÑA
========================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            FAVORITOS_KEY
        ) {

            renderizarFavoritos();

            actualizarContadorFavoritos();

        }


        if (
            event.key ===
            CARRITO_KEY
        ) {

            actualizarContadorCarrito();

        }

    }
);


/* ==========================================================
   CAMBIOS EN LA MISMA PÁGINA
========================================================== */

window.addEventListener(
    "clinibox:favoritos",
    () => {

        renderizarFavoritos();

        actualizarContadorFavoritos();

    }
);


/* ==========================================================
   INICIAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarContadorFavoritos();

        actualizarContadorCarrito();

        renderizarFavoritos();


        if (
            typeof lucide !== "undefined" &&
            lucide.createIcons
        ) {

            lucide.createIcons();

        }

    }
);

window.cliniboxFavorites = Object.freeze({
    all: obtenerFavoritos,
    has: esFavorito,
    toggle: alternarFavorito
});

})();