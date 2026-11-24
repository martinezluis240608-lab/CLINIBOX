const FARMACIA_API = "/CLINIBOX/public/api/farmacia";
const state = { products: [], orders: [], sales: [], cart: new Map(), activeView: "caja" };
const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
const money = value => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value) || 0);

// Cliente común de la API: envía acciones y convierte respuestas JSON.
async function api(resource, payload) {
    const options = payload
        ? { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) }
        : { method: "GET", credentials: "same-origin", headers: { "Accept": "application/json" } };
    const response = await fetch(payload ? FARMACIA_API : `${FARMACIA_API}?resource=${encodeURIComponent(resource)}`, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "No se pudo conectar con CliniBox.");
    return data;
}

// Muestra avisos de éxito o error en la interfaz.
function showNotice(message, type = "success") {
    const notice = $("#notice");
    notice.textContent = message;
    notice.className = `notice show ${type}`;
    clearTimeout(showNotice.timer);
    showNotice.timer = setTimeout(() => notice.classList.remove("show"), 4300);
}

function productById(id) { return state.products.find(product => String(product.id) === String(id)); }
function productByBarcode(code) { return state.products.find(product => String(product.barcode).toLowerCase() === String(code).trim().toLowerCase()); }
function stockClass(product) { return product.stock <= 0 ? "out" : product.stock <= product.min_stock ? "low" : ""; }

// Sincroniza productos y existencias desde el servidor.
async function refreshProducts() {
    const data = await api("products");
    state.products = data.products || [];
    renderProducts();
    renderInventory();
    renderStats();
}

// Actualiza los pedidos visibles para el personal de farmacia.
async function refreshOrders() {
    const data = await api("orders");
    state.orders = data.orders || [];
    renderOrders();
    renderStats();
}

// Carga los tickets recientes y estadísticas de caja.
async function refreshSales() {
    const data = await api("sales");
    state.sales = data.sales || [];
    renderSales();
    renderStats();
}

async function refreshAll() {
    try {
        await Promise.all([refreshProducts(), refreshOrders(), refreshSales()]);
    } catch (error) {
        showNotice(error.message, "error");
    }
}

// Dibuja el catálogo que se usa para agregar productos al ticket.
function renderProducts() {
    const term = $("#productSearch").value.trim().toLocaleLowerCase("es-MX");
    const products = state.products.filter(product => `${product.name} ${product.category} ${product.barcode}`.toLocaleLowerCase("es-MX").includes(term));
    $("#productCountLabel").textContent = `${products.length} productos`;
    $("#productGrid").innerHTML = products.map(product => `
        <button class="product-card ${stockClass(product)}" type="button" data-add-product="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
            <span class="product-card-top"><span class="product-emoji">${escapeHtml(product.emoji || "💊")}</span><span class="stock-tag ${stockClass(product)}">${product.stock <= 0 ? "Agotado" : `${product.stock} pzas.`}</span></span>
            <strong>${escapeHtml(product.name)}</strong><span class="product-category">${escapeHtml(product.category)}</span>
            <span class="product-barcode">${escapeHtml(product.barcode)}</span>
            <span class="product-card-foot"><b>${money(product.price)}</b><span class="add-symbol">＋</span></span>
        </button>`).join("") || `<div class="empty-list"><strong>Sin coincidencias</strong>Registra el producto desde Inventario.</div>`;
}

// Construye filas editables de inventario y filtros de stock.
function renderInventory() {
    const term = $("#inventorySearch").value.trim().toLocaleLowerCase("es-MX");
    const filter = $("#stockFilter").value;
    const products = state.products.filter(product => {
        const matches = `${product.name} ${product.category} ${product.barcode}`.toLocaleLowerCase("es-MX").includes(term);
        return matches && (filter === "todos" || (filter === "bajo" && product.stock > 0 && product.stock <= product.min_stock) || (filter === "agotado" && product.stock === 0));
    });
    $("#inventoryCount").textContent = `${products.length} productos`;
    $("#inventoryRows").innerHTML = products.map(product => `<tr data-inventory-row="${product.id}">
        <td><span class="inventory-name"><span class="inventory-emoji">${escapeHtml(product.emoji || "💊")}</span><span><strong>${escapeHtml(product.name)}</strong><small class="product-category">${escapeHtml(product.category)}</small></span></span></td>
        <td><span class="inventory-barcode">${escapeHtml(product.barcode)}</span><br><button class="text-button" type="button" data-show-barcode="${product.id}">ver etiqueta</button></td>
        <td><input class="price-input" type="number" min="0" step=".01" aria-label="Precio de ${escapeHtml(product.name)}" value="${Number(product.price).toFixed(2)}"></td>
        <td><input class="stock-input" type="number" min="0" step="1" aria-label="Stock de ${escapeHtml(product.name)}" value="${product.stock}"></td>
        <td><input class="min-input" type="number" min="0" step="1" aria-label="Stock mínimo de ${escapeHtml(product.name)}" value="${product.min_stock}"></td>
        <td><button class="save-stock" type="button" data-save-product="${product.id}">Guardar</button></td>
    </tr>`).join("") || `<tr><td colspan="6"><div class="empty-list">No hay productos para mostrar.</div></td></tr>`;
}

function cartLines() {
    return [...state.cart.entries()].map(([id, quantity]) => ({ product: productById(id), quantity })).filter(line => line.product);
}

// Actualiza renglones, subtotal y total del carrito actual.
function renderTicket() {
    const lines = cartLines();
    const subtotal = lines.reduce((sum, line) => sum + Number(line.product.price) * line.quantity, 0);
    $("#saleSubtotal").textContent = money(subtotal);
    $("#saleTotal").textContent = money(subtotal);
    $("#chargeTotal").textContent = money(subtotal);
    $("#chargeButton").disabled = !lines.length;
    $("#saleItems").innerHTML = lines.length ? lines.map(({ product, quantity }) => `
        <div class="sale-line"><div><span class="sale-line-name">${escapeHtml(product.name)}</span><span class="sale-line-code">${escapeHtml(product.barcode)}</span><div class="quantity-controls"><button type="button" data-cart-action="minus" data-id="${product.id}" aria-label="Quitar una unidad">−</button><strong>${quantity}</strong><button type="button" data-cart-action="plus" data-id="${product.id}" aria-label="Agregar una unidad">＋</button><button type="button" class="remove-line" data-cart-action="remove" data-id="${product.id}">Quitar</button></div></div><span class="sale-line-price">${money(product.price * quantity)}</span></div>`).join("") : `<div class="empty-state"><span>▤</span><strong>Escanea el primer producto</strong><small>Aparecerá aquí junto con el total.</small></div>`;
}

function renderStats() {
    const low = state.products.filter(product => product.stock <= product.min_stock).length;
    const pending = state.orders.filter(order => !["verificado", "cancelado"].includes(order.status)).length;
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = state.sales.filter(sale => String(sale.created_at || "").slice(0, 10) === today);
    $("#statProducts").textContent = state.products.length;
    $("#statUnits").textContent = state.products.reduce((total, product) => total + Number(product.stock), 0);
    $("#statPending").textContent = pending;
    $("#statToday").textContent = money(todaySales.reduce((total, sale) => total + Number(sale.total), 0));
    $("#statSalesCount").textContent = `${todaySales.length} ${todaySales.length === 1 ? "ticket" : "tickets"}`;
    $("#lowStockBadge").textContent = low;
    $("#ordersBadge").textContent = pending;
}

const statusLabels = { recibido: "Recibido", preparando: "Preparando", listo: "Listo para entregar", enviado: "Enviado", en_transito: "En tránsito", entregado: "Entregado", verificado: "Entrega verificada", cancelado: "Cancelado" };

// Presenta pedidos y controles para su ciclo de envío/entrega.
function renderOrders() {
    const filter = $("#orderFilter").value;
    const orders = state.orders.filter(order => {
        if (filter === "pendientes") return !["verificado", "cancelado"].includes(order.status);
        if (filter === "envio" || filter === "recoger") return order.delivery_type === filter;
        return true;
    });
    $("#ordersCount").textContent = `${orders.length} pedidos`;
    $("#ordersList").innerHTML = orders.length ? orders.map(order => {
        const items = (order.items || []).map(item => `${escapeHtml(item.name)} × ${Number(item.quantity)}`).join(" · ");
        const delivery = order.delivery_type === "recoger" ? "Recoger en farmacia" : "Envío a domicilio";
        const statusClass = ["verificado"].includes(order.status) ? "done" : ["cancelado"].includes(order.status) ? "alert" : "";
        return `<article class="order-card" data-order-card="${escapeHtml(order.id)}">
            <div class="order-card-head"><div><span class="order-code">${escapeHtml(order.id)}</span><span class="order-meta">${new Date(order.created_at).toLocaleString("es-MX")} · ${escapeHtml(order.customer_name)} · ${escapeHtml(order.customer_email)}</span></div><span class="status-pill ${statusClass}">${escapeHtml(statusLabels[order.status] || order.status)}</span></div>
            <div class="order-details"><div><span>Entrega</span><strong>${delivery}</strong></div><div><span>Destino</span><strong>${escapeHtml(order.destination || "Recoger en mostrador")}</strong></div><div><span>Total</span><strong>${money(order.total)}</strong></div></div>
            <div class="order-item-list">${items || "Sin productos"}<br>${order.carrier || order.tracking_number ? `Envío: ${escapeHtml(order.carrier)} · Guía: ${escapeHtml(order.tracking_number)}` : "Aún no hay guía de envío."}</div>
            ${order.status === "verificado" || order.status === "cancelado" ? "" : `<div class="order-actions">
                <label>Estado<select data-order-status>${Object.entries(statusLabels).map(([value,label]) => `<option value="${value}" ${value === order.status ? "selected" : ""}>${label}</option>`).join("")}</select></label>
                <label>Paquetería<input data-order-carrier maxlength="80" placeholder="Paquetería" value="${escapeHtml(order.carrier || "")}"></label>
                <label>Número de guía<input data-order-tracking maxlength="80" placeholder="Guía / rastreo" value="${escapeHtml(order.tracking_number || "")}"></label>
                <label>Nota de entrega<input data-order-note maxlength="300" placeholder="Nota o confirmación de destino" value="${escapeHtml(order.delivery_note || "")}"></label>
                <button class="primary-button" type="button" data-update-order="${escapeHtml(order.id)}">Guardar</button>
            </div>`}
        </article>`;
    }).join("") : `<div class="empty-list"><strong>No hay pedidos en esta vista</strong>Los pedidos en línea aparecerán aquí cuando se confirmen.</div>`;
}

// Muestra el historial de ventas en la tabla de caja.
function renderSales() {
    $("#salesRows").innerHTML = state.sales.length ? state.sales.map(sale => `<tr><td><strong>${escapeHtml(sale.id)}</strong></td><td>${new Date(sale.created_at).toLocaleString("es-MX")}</td><td>${(sale.items || []).map(item => `${escapeHtml(item.name)} × ${Number(item.quantity)}`).join(", ")}</td><td>${escapeHtml(sale.payment_method)}</td><td><strong>${money(sale.total)}</strong></td></tr>`).join("") : `<tr><td colspan="5"><div class="empty-list">Todavía no hay ventas registradas.</div></td></tr>`;
}

function addProduct(product) {
    const current = state.cart.get(String(product.id)) || 0;
    if (current + 1 > Number(product.stock)) {
        showNotice(`No hay suficientes existencias de ${product.name}.`, "error");
        return;
    }
    state.cart.set(String(product.id), current + 1);
    renderTicket();
    $("#barcodeInput").focus();
}

// Busca el código leído por el escáner y lo suma al ticket.
function scanBarcode() {
    const code = $("#barcodeInput").value.trim();
    if (!code) return;
    const product = productByBarcode(code);
    $("#barcodeInput").value = "";
    if (product) {
        addProduct(product);
        return;
    }
    openProductDialog({ barcode: code });
    showNotice("Ese código no está en el catálogo. Regístralo para seguir cobrando.", "error");
}

function openProductDialog(product = null) {
    $("#productForm").reset();
    $("#editProductId").value = product?.id || "";
    $("#productDialogTitle").textContent = product ? "Editar producto" : "Nuevo producto";
    $("#productName").value = product?.name || "";
    $("#productCategory").value = product?.category || "Medicamentos";
    $("#productBarcode").value = product?.barcode || "";
    $("#productPrice").value = product?.price ?? "";
    $("#productStock").value = product?.stock ?? 0;
    $("#productMinStock").value = product?.min_stock ?? 5;
    $("#productDialog").showModal();
    $("#productName").focus();
}

// Valida y guarda los datos del producto en el servidor.
async function saveProduct(event) {
    event.preventDefault();
    try {
        const data = await api(null, {
            action: "save_product",
            id: $("#editProductId").value || 0,
            name: $("#productName").value,
            category: $("#productCategory").value,
            barcode: $("#productBarcode").value,
            price: $("#productPrice").value,
            stock: $("#productStock").value,
            min_stock: $("#productMinStock").value,
        });
        $("#productDialog").close();
        await refreshProducts();
        showNotice(`Producto guardado. Código: ${data.product.barcode}`);
        $("#barcodeInput").focus();
    } catch (error) { showNotice(error.message, "error"); }
}

async function saveInventoryRow(id) {
    const row = $(`[data-inventory-row="${CSS.escape(String(id))}"]`);
    const product = productById(id);
    if (!row || !product) return;
    try {
        const data = await api(null, { action: "save_product", id, name: product.name, category: product.category, barcode: product.barcode, price: $(".price-input", row).value, stock: $(".stock-input", row).value, min_stock: $(".min-input", row).value, emoji: product.emoji });
        await refreshProducts();
        showNotice(`Inventario actualizado para ${data.product.name}.`);
    } catch (error) { showNotice(error.message, "error"); }
}

// Registra la venta; la API valida y descuenta existencias.
async function chargeSale() {
    const lines = cartLines();
    if (!lines.length) return;
    $("#chargeButton").disabled = true;
    try {
        const data = await api(null, { action: "sale", payment_method: $("#paymentMethod").value, items: lines.map(({ product, quantity }) => ({ barcode: product.barcode, quantity })) });
        state.cart.clear();
        renderTicket();
        await Promise.all([refreshProducts(), refreshSales()]);
        showReceipt(data.sale);
        $("#receiptDialog").showModal();
    } catch (error) {
        showNotice(error.message, "error");
        await refreshProducts();
    } finally { $("#chargeButton").disabled = false; }
}

function showReceipt(sale) {
    $("#receiptContent").innerHTML = `<div class="receipt-head"><strong>CliniBox · Farmacia</strong><span>Comprobante de venta</span><br><small>${escapeHtml(sale.id)} · ${new Date(sale.created_at).toLocaleString("es-MX")}</small></div><div class="receipt-lines">${sale.items.map(item => `<div>${escapeHtml(item.name)} × ${item.quantity} <span style="float:right">${money(item.total)}</span></div>`).join("")}<div>Método de pago: ${escapeHtml(sale.payment_method)}</div></div><div class="receipt-total"><span>Total</span><span>${money(sale.total)}</span></div>`;
}

// Guarda estado, paquetería, guía y nota del pedido.
async function updateOrder(button) {
    const card = button.closest("[data-order-card]");
    button.disabled = true;
    try {
        await api(null, { action: "update_order", id: button.dataset.updateOrder, status: $("[data-order-status]", card).value, carrier: $("[data-order-carrier]", card).value, tracking_number: $("[data-order-tracking]", card).value, delivery_note: $("[data-order-note]", card).value });
        await Promise.all([refreshOrders(), refreshProducts()]);
        showNotice("Se actualizó el estado del pedido y su seguimiento.");
    } catch (error) { showNotice(error.message, "error"); }
    finally { button.disabled = false; }
}

// Cambia entre caja, inventario, pedidos y ventas.
function switchView(view) {
    state.activeView = view;
    document.querySelectorAll(".pos-view").forEach(section => section.classList.toggle("active", section.id === `view-${view}`));
    document.querySelectorAll(".side-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    const titles = { caja: "Caja de venta", inventario: "Inventario", pedidos: "Pedidos en línea", ventas: "Ventas" };
    $("#pageTitle").textContent = titles[view] || "Farmacia";
    if (view === "pedidos") refreshOrders();
    if (view === "ventas") refreshSales();
    if (view === "caja") $("#barcodeInput").focus();
}

// Genera el dibujo SVG de una etiqueta EAN para imprimir.
function makeEanSvg(value) {
    const code = String(value);
    if (!/^\d{13}$/.test(code)) return "";
    const L = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
    const G = ["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
    const R = ["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];
    const parity = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];
    let bits = "101";
    const first = Number(code[0]);
    for (let i = 1; i <= 6; i++) bits += (parity[first][i - 1] === "L" ? L : G)[Number(code[i])];
    bits += "01010";
    for (let i = 7; i <= 12; i++) bits += R[Number(code[i])];
    bits += "101";
    const bars = [...bits].map((bit, index) => bit === "1" ? `<rect x="${index + 4}" y="2" width="1" height="37"/>` : "").join("");
    return `<svg class="barcode-svg" viewBox="0 0 125 53" role="img" aria-label="Código de barras ${code}" xmlns="http://www.w3.org/2000/svg"><g fill="#183b52">${bars}</g><text x="62" y="50" text-anchor="middle" fill="#183b52" font-family="monospace" font-size="8">${code}</text></svg>`;
}

document.querySelectorAll(".side-link").forEach(button => button.addEventListener("click", () => switchView(button.dataset.view)));
$("#barcodeInput").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); scanBarcode(); } });
$("#scanButton").addEventListener("click", scanBarcode);
$("#productSearch").addEventListener("input", renderProducts);
$("#productGrid").addEventListener("click", event => { const button = event.target.closest("[data-add-product]"); if (button) addProduct(productById(button.dataset.addProduct)); });
$("#saleItems").addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const id = String(button.dataset.id);
    const current = state.cart.get(id) || 0;
    if (button.dataset.cartAction === "remove" || (button.dataset.cartAction === "minus" && current <= 1)) state.cart.delete(id);
    else if (button.dataset.cartAction === "minus") state.cart.set(id, current - 1);
    else { const product = productById(id); if (product && current < product.stock) state.cart.set(id, current + 1); else showNotice("No hay más existencias disponibles.", "error"); }
    renderTicket();
});
$("#clearCart").addEventListener("click", () => { state.cart.clear(); renderTicket(); });
$("#chargeButton").addEventListener("click", chargeSale);
$("#newProductButton").addEventListener("click", () => openProductDialog());
$("#productForm").addEventListener("submit", saveProduct);
document.querySelectorAll("[data-close-product]").forEach(button => button.addEventListener("click", () => $("#productDialog").close()));
$("#inventorySearch").addEventListener("input", renderInventory);
$("#stockFilter").addEventListener("change", renderInventory);
$("#inventoryRows").addEventListener("click", event => {
    const save = event.target.closest("[data-save-product]");
    if (save) { saveInventoryRow(save.dataset.saveProduct); return; }
    const label = event.target.closest("[data-show-barcode]");
    if (label) {
        const product = productById(label.dataset.showBarcode);
        const receipt = $("#receiptContent");
        receipt.innerHTML = `<div class="receipt-head"><strong>${escapeHtml(product.name)}</strong><span>Etiqueta interna de inventario</span></div>${makeEanSvg(product.barcode)}`;
        $("#receiptDialog").showModal();
    }
});
$("#orderFilter").addEventListener("change", renderOrders);
$("#ordersList").addEventListener("click", event => { const button = event.target.closest("[data-update-order]"); if (button) updateOrder(button); });
$("#refreshOrders").addEventListener("click", refreshOrders);
$("#refreshSales").addEventListener("click", refreshSales);
$("#printReceipt").addEventListener("click", () => window.print());
document.querySelectorAll("[data-close-receipt]").forEach(button => button.addEventListener("click", () => $("#receiptDialog").close()));
$("#productBarcode").addEventListener("keydown", event => { if (event.key === "Enter") event.preventDefault(); });

try {
    const session = JSON.parse(localStorage.getItem("clinibox_session") || "null");
    if (session?.role === "admin") $("#cashierName").textContent = session.email || "Farmacia";
} catch (_) {}

renderTicket();
refreshAll();
setInterval(() => { if (state.activeView === "pedidos") refreshOrders(); }, 30000);


