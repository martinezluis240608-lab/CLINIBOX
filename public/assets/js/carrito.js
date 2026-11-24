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

    window.dispatchEvent(new Event("clinibox:cart-updated"));

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
    const codigoBarras = producto.barcode || generarCodigoBarras(producto);

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
        existente.barcode = codigoBarras;
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
            barcode: codigoBarras,
            quantity: cantidad
        });

    }

    guardarCarrito(carrito);

    return existente || carrito[carrito.length - 1];

}

function generarCodigoBarras(producto = {}) {
    const normalizar = value => String(value || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const key = `${normalizar(producto.category || producto.categoria)}|${normalizar(producto.name || producto.nombre)}`;
    const seedCodes = {
        "paracetamol-500-mg": "2000000000015",
        "vitamina-c-1000-mg": "2000000000022",
        "termometro-digital": "2000000000039",
        "gasas-esteriles": "2000000000046",
        "gel-antibacterial": "2000000000053",
        "protector-solar-fps-50": "2000000000060",
        "ibuprofeno-400-mg": "2000000000077",
        "multivitaminico": "2000000000084",
        "tensiometro-digital": "2000000000091",
        "oximetro-de-pulso": "2000000000107",
        "kit-de-curacion": "2000000000114",
        "crema-hidratante": "2000000000121"
    };
    const nameKey = key.split("|").pop();
    if (seedCodes[nameKey]) return seedCodes[nameKey];
    let hash = 0;
    for (let index = 0; index < key.length; index++) hash = (Math.imul(hash, 31) + key.charCodeAt(index)) >>> 0;
    const base = `200${String(hash % 1000000000).padStart(9, "0")}`;
    let sum = 0;
    for (let index = 0; index < 12; index++) sum += Number(base[index]) * (index % 2 === 0 ? 1 : 3);
    return `${base}${(10 - sum % 10) % 10}`;
}

window.cliniboxCart = Object.freeze({
    add: agregarProductoAlCarrito,
    all: obtenerCarrito,
    barcodeFor: generarCodigoBarras
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
                    href="/CLINIBOX/public/tienda"
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


    abrirFormularioPedido();

}

function abrirFormularioPedido() {
    let modal = document.getElementById("onlineOrderModal");
    if (!modal) {
        modal = document.createElement("dialog");
        modal.id = "onlineOrderModal";
        modal.className = "online-order-dialog";
        modal.innerHTML = `
            <form id="onlineOrderForm">
                <button type="button" class="online-order-close" aria-label="Cerrar">×</button>
                <span class="online-order-kicker">COMPRA EN LÍNEA</span>
                <h2>Datos de entrega</h2>
                <p>Farmacia recibirá tu pedido y lo actualizará durante la preparación y el envío.</p>
                <label>Nombre completo<input name="customer_name" required maxlength="120" autocomplete="name"></label>
                <label>Correo para seguimiento<input name="customer_email" type="email" required maxlength="160" autocomplete="email"></label>
                <label>Teléfono<input name="customer_phone" type="tel" maxlength="40" autocomplete="tel"></label>
                <label>Cómo recibirás el pedido<select name="delivery_type"><option value="envio">Envío a domicilio</option><option value="recoger">Recoger en farmacia</option></select></label>
                <label class="destination-label">Dirección de entrega<textarea name="destination" maxlength="300" rows="2" placeholder="Calle, número, colonia, municipio y referencias"></textarea></label>
                <small class="online-order-shipping">El envío cuesta $90; es gratis en compras de $500 o más. Recoger en farmacia no tiene costo.</small>
                <div class="online-order-error" role="alert"></div>
                <button class="online-order-submit" type="submit">Confirmar pedido</button>
            </form>`;
        document.body.appendChild(modal);
        modal.querySelector(".online-order-close").addEventListener("click", () => modal.close());
        modal.querySelector('[name="delivery_type"]').addEventListener("change", () => {
            const pickup = modal.querySelector('[name="delivery_type"]').value === "recoger";
            modal.querySelector(".destination-label").hidden = pickup;
            modal.querySelector('[name="destination"]').required = !pickup;
        });
        modal.querySelector("form").addEventListener("submit", crearPedidoEnLinea);
    }

    const form = modal.querySelector("form");
    form.reset();
    try {
        const session = JSON.parse(localStorage.getItem("clinibox_session") || "null");
        if (session?.email) form.elements.customer_email.value = session.email;
    } catch (_) {}
    modal.querySelector(".online-order-error").textContent = "";
    modal.showModal();
}

async function crearPedidoEnLinea(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const modal = form.closest("dialog");
    const button = form.querySelector(".online-order-submit");
    const error = form.querySelector(".online-order-error");
    const data = new FormData(form);
    const deliveryType = String(data.get("delivery_type"));
    const carrito = obtenerCarrito();
    button.disabled = true;
    button.textContent = "Confirmando…";
    error.textContent = "";

    try {
        const response = await fetch("/CLINIBOX/public/api/farmacia", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                action: "online_order",
                customer_name: data.get("customer_name"),
                customer_email: data.get("customer_email"),
                customer_phone: data.get("customer_phone"),
                delivery_type: deliveryType,
                destination: deliveryType === "recoger" ? "" : data.get("destination"),
                items: carrito.map(item => ({
                    barcode: item.barcode || window.cliniboxCart.barcodeFor(item),
                    name: item.name || item.nombre,
                    category: item.category || item.categoria,
                    price: item.price || item.precio,
                    emoji: item.emoji || item.imagen,
                    quantity: item.quantity || item.cantidad || 1
                }))
            })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "No se pudo registrar el pedido.");

        let refs = [];
        try { refs = JSON.parse(localStorage.getItem("cliniboxOrderRefs") || "[]"); } catch (_) {}
        refs.unshift({ id: result.order.id, token: result.tracking_token, email: result.order.customer_email });
        localStorage.setItem("cliniboxOrderRefs", JSON.stringify(refs.slice(0, 25)));
        localStorage.setItem("clinibox_customer_email", result.order.customer_email);
        guardarCarrito([]);
        modal.close();
        window.location.href = "/CLINIBOX/public/pedidos?folio=" + encodeURIComponent(result.order.id);
    } catch (requestError) {
        error.textContent = requestError.message;
    } finally {
        button.disabled = false;
        button.textContent = "Confirmar pedido";
    }
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
                "/CLINIBOX/public/favoritos";

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
                "/CLINIBOX/public/carrito";

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

        // Las recetas usan el mismo almacenamiento y API que el resto de la tienda.
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
