/* ==========================================================
   CLINIBOX - CARRITO
   Comparte el mismo carrito utilizado por la tienda.
========================================================== */


/* ==========================================================
   CLAVE DEL CARRITO
========================================================== */

const CARRITO_KEY =
    "cliniboxCart";


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

        console.error(
            "Error leyendo carrito:",
            error
        );

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

    renderizarCarrito();

}

function agregarProductoAlCarrito(producto) {

    const carrito = obtenerCarrito();
    const nombre = producto.name || producto.nombre || "Producto";
    const categoria = producto.category || producto.categoria || "Producto";
    const id = String(producto.id || `${categoria}:${nombre}`);
    const cantidad = Math.max(
        1,
        Number(producto.quantity || producto.cantidad || 1)
    );

    const existente = carrito.find(item =>
        String(item.id || "") === id
        || (
            (item.name || item.nombre) === nombre
            && (item.category || item.categoria) === categoria
        )
    );

    if (existente) {

        existente.id = id;
        existente.name = nombre;
        existente.category = categoria;
        existente.price = Number(producto.price || producto.precio || existente.price || 0);
        existente.oldPrice = Number(producto.oldPrice || existente.oldPrice || existente.price);
        existente.emoji = producto.emoji || producto.imagen || existente.emoji || "💊";
        existente.quantity = Number(existente.quantity || existente.cantidad || 0) + cantidad;
        delete existente.cantidad;

    } else {

        carrito.push({
            id,
            name: nombre,
            category: categoria,
            price: Number(producto.price || producto.precio || 0),
            oldPrice: Number(producto.oldPrice || producto.precio || producto.price || 0),
            emoji: producto.emoji || producto.imagen || "💊",
            quantity: cantidad
        });

    }

    guardarCarrito(carrito);

    return existente || carrito[carrito.length - 1];

}

window.cliniboxCart = Object.freeze({
    add: agregarProductoAlCarrito,
    all: obtenerCarrito
});


/* ==========================================================
   CONTADOR DEL CARRITO
========================================================== */

function actualizarContadorCarrito() {

    const elemento =
        document.getElementById(
            "cartCount"
        );


    if (!elemento) return;


    const cantidad =
        obtenerCarrito().reduce(
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


    elemento.textContent =
        cantidad;

}


/* ==========================================================
   ELIMINAR PRODUCTO
========================================================== */

function eliminarDelCarrito(
    id
) {

    const carrito =
        obtenerCarrito().filter(
            item =>
                String(item.id) !==
                String(id)
        );


    guardarCarrito(
        carrito
    );

}


/* ==========================================================
   ACTUALIZAR CANTIDAD
========================================================== */

function actualizarCantidad(
    id,
    cantidad
) {

    const carrito =
        obtenerCarrito();


    const producto =
        carrito.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!producto) return;


    producto.quantity =
        Math.max(
            1,
            Number(cantidad) || 1
        );


    guardarCarrito(
        carrito
    );

}


/* ==========================================================
   CAMBIAR CANTIDAD CON + / -
========================================================== */

function cambiarCantidad(
    id,
    cantidad
) {

    const carrito =
        obtenerCarrito();


    const producto =
        carrito.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!producto) return;


    producto.quantity =
        Number(
            producto.quantity || 1
        ) + Number(cantidad);


    /*
       Si llega a cero,
       eliminamos el producto.
    */

    if (
        producto.quantity <= 0
    ) {

        eliminarDelCarrito(
            id
        );

        return;

    }


    guardarCarrito(
        carrito
    );

}


/* ==========================================================
   RENDERIZAR CARRITO
========================================================== */

function renderizarCarrito() {

    const contenedor =
        document.getElementById(
            "cartContent"
        );


    if (!contenedor) return;


    const carrito =
        obtenerCarrito();


    /* =====================================================
       CARRITO VACÍO
    ====================================================== */

    if (
        carrito.length === 0
    ) {

        contenedor.innerHTML = `

            <section class="cart-products cart-empty">

                <i
                    data-lucide="shopping-cart"
                    class="cart-empty-icon"
                ></i>


                <h2>

                    Tu carrito está vacío

                </h2>


                <p>

                    Agrega productos desde nuestra tienda.

                </p>


                <a
                    href="/CLINIBOX/CLINIBOX/public/tienda"
                    class="checkout-button cart-empty-button"
                >

                    Explorar tienda

                </a>

            </section>

        `;


        if (
            typeof lucide !== "undefined" &&
            lucide.createIcons
        ) {

            lucide.createIcons();

        }


        return;

    }


    /* =====================================================
       CALCULAR SUBTOTAL
    ====================================================== */

    let subtotal = 0;


    const productosHTML =
        carrito
            .map(
                producto => {

                    const precio =
                        Number(
                            producto.price || 0
                        );


                    const cantidad =
                        Number(
                            producto.quantity || 1
                        );


                    const totalProducto =
                        precio *
                        cantidad;


                    subtotal +=
                        totalProducto;


                    const imagen =
                        producto.emoji ||
                        producto.imagen ||
                        "💊";


                    return `

                        <article class="cart-item">


                            <!-- IMAGEN -->

                            <div class="cart-item-image">

                                <span>

                                    ${imagen}

                                </span>

                            </div>


                            <!-- INFORMACIÓN -->

                            <div class="cart-item-info">


                                <small>

                                    ${
                                        producto.category ||
                                        producto.categoria ||
                                        "Producto"
                                    }

                                </small>


                                <h3>

                                    ${
                                        producto.name ||
                                        producto.nombre ||
                                        "Producto"
                                    }

                                </h3>


                                <div class="cart-item-price-mobile">

                                    $${precio.toFixed(2)}

                                </div>


                                <!-- CANTIDAD -->

                                <div class="cart-quantity">

                                    <button
                                        type="button"
                                        class="cart-quantity-button"
                                        data-action="decrease"
                                        data-id="${producto.id}"
                                    >

                                        −

                                    </button>


                                    <span>

                                        ${cantidad}

                                    </span>


                                    <button
                                        type="button"
                                        class="cart-quantity-button"
                                        data-action="increase"
                                        data-id="${producto.id}"
                                    >

                                        +

                                    </button>

                                </div>


                                <!-- ELIMINAR -->

                                <button
                                    type="button"
                                    class="cart-remove"
                                    data-remove-id="${producto.id}"
                                >

                                    <i data-lucide="trash-2"></i>

                                    Eliminar

                                </button>


                            </div>


                            <!-- PRECIO -->

                            <div class="cart-price">

                                $${totalProducto.toFixed(2)}

                            </div>


                        </article>

                    `;

                }
            )
            .join("");


    /* =====================================================
       ENVÍO
       Más de $500 = envío gratis
    ====================================================== */

    const envio =
        subtotal >= 500
            ? 0
            : 90;


    const total =
        subtotal +
        envio;


    /* =====================================================
       HTML COMPLETO
    ====================================================== */

    contenedor.innerHTML = `

        <section class="cart-products">

            ${productosHTML}

        </section>


        <aside class="cart-summary">

            <h2>

                Resumen

            </h2>


            <div class="summary-row">

                <span>

                    Subtotal

                </span>

                <strong>

                    $${subtotal.toFixed(2)}

                </strong>

            </div>


            <div class="summary-row">

                <span>

                    Envío

                </span>

                <strong>

                    ${
                        envio === 0
                            ? "GRATIS"
                            : "$" + envio.toFixed(2)
                    }

                </strong>

            </div>


            <div class="summary-row summary-total">

                <span>

                    Total

                </span>

                <strong>

                    $${total.toFixed(2)}

                </strong>

            </div>


            <!--
                Por ahora NO tocamos login.
                Este botón solamente queda preparado
                para la siguiente etapa.
            -->

            <button
                id="btnContinuarCompra"
                class="checkout-button"
                type="button"
            >

                CONTINUAR CON LA COMPRA

            </button>

        </aside>

    `;


    /* =====================================================
       BOTONES + / -
    ====================================================== */

    document
        .querySelectorAll(
            ".cart-quantity-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            button.dataset.id;


                        const action =
                            button.dataset.action;


                        if (
                            action ===
                            "increase"
                        ) {

                            cambiarCantidad(
                                id,
                                1
                            );

                        }


                        if (
                            action ===
                            "decrease"
                        ) {

                            cambiarCantidad(
                                id,
                                -1
                            );

                        }

                    }
                );

            }
        );


    /* =====================================================
       BOTONES ELIMINAR
    ====================================================== */

    document
        .querySelectorAll(
            ".cart-remove"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        eliminarDelCarrito(
                            button.dataset.removeId
                        );

                    }
                );

            }
        );


    /* =====================================================
       CONTINUAR COMPRA
       No hacemos login todavía.
    ====================================================== */

    const continuar =
        document.getElementById(
            "btnContinuarCompra"
        );


    if (continuar) {

        continuar.addEventListener(
            "click",
            continuarCompra
        );

    }


    if (
        typeof lucide !== "undefined" &&
        lucide.createIcons
    ) {

        lucide.createIcons();

    }

}


/* ==========================================================
   CONTINUAR COMPRA
========================================================== */

function continuarCompra() {

    const carrito =
        obtenerCarrito();


    if (
        carrito.length === 0
    ) {

        alert(
            "Tu carrito está vacío."
        );

        return;

    }


    /*
       NO tocamos login todavía.
       La siguiente etapa puede conectar
       este botón con el proceso de compra.
    */

    alert(
        "Tu carrito está listo para continuar con la compra."
    );

}


/* ==========================================================
   BOTÓN FAVORITOS
========================================================== */

{

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

}


/* ==========================================================
   BOTÓN CARRITO
========================================================== */

{

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

}


/* ==========================================================
   SINCRONIZACIÓN ENTRE PESTAÑAS
========================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            CARRITO_KEY
        ) {

            actualizarContadorCarrito();

            renderizarCarrito();

        }

    }
);


/* ==========================================================
   INICIALIZAR
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        actualizarContadorCarrito();

        renderizarCarrito();

        document.querySelectorAll(".recipe-add").forEach(button => {

            let resetTimer;

            const defaultLabel =
                `Añadir ${button.dataset.productName} al carrito`;

            button.setAttribute("aria-label", defaultLabel);
            button.title = defaultLabel;

            button.addEventListener("click", () => {

                window.cliniboxCart.add({
                    id: button.dataset.productId,
                    name: button.dataset.productName,
                    category: button.dataset.productCategory,
                    price: Number(button.dataset.productPrice),
                    oldPrice: Number(button.dataset.productOldPrice),
                    emoji: button.dataset.productImage,
                    quantity: 1
                });

                button.classList.add("added");
                button.innerHTML = '<i data-lucide="check" aria-hidden="true"></i>';
                button.setAttribute(
                    "aria-label",
                    `${button.dataset.productName} agregado al carrito`
                );

                if (typeof lucide !== "undefined") lucide.createIcons();

                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {

                    button.classList.remove("added");
                    button.innerHTML = '<i data-lucide="shopping-cart" aria-hidden="true"></i>';
                    button.setAttribute("aria-label", defaultLabel);
                    button.title = defaultLabel;

                    if (typeof lucide !== "undefined") lucide.createIcons();

                }, 1400);

            });

        });


        if (
            typeof lucide !== "undefined" &&
            lucide.createIcons
        ) {

            lucide.createIcons();

        }

    }
);