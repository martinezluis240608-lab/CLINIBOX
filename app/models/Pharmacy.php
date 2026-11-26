<?php

namespace App\Models;

use App\Config\Database;
use DomainException;
use PDO;
use Throwable;

/** Acceso al catálogo, ventas y pedidos del punto de venta de farmacia. */
class Pharmacy
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::connection();
    }

    public function products(): array
    {
        $statement = $this->db->query(
            'SELECT id, codigo_barras AS barcode, nombre AS name, categoria AS category,
                    precio AS price, stock, stock_minimo AS min_stock, emoji
             FROM productos WHERE activo = 1 ORDER BY nombre'
        );

        return array_map([$this, 'normaliseProduct'], $statement->fetchAll());
    }

    public function orders(): array
    {
        $statement = $this->db->query(
            'SELECT id, folio, cliente_nombre, cliente_email, cliente_telefono, tipo_entrega,
                    destino, estado, paqueteria, numero_guia, nota_entrega, subtotal, envio,
                    total, entregado_en, verificado_en, created_at, updated_at
             FROM pedidos ORDER BY id DESC'
        );
        $orders = $statement->fetchAll();
        if (!$orders) {
            return [];
        }

        $ids = array_column($orders, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $details = $this->db->prepare(
            "SELECT pedido_id, producto_id, codigo_barras, producto_nombre, cantidad, precio_unitario, total_linea
             FROM pedido_detalles WHERE pedido_id IN ({$placeholders}) ORDER BY id"
        );
        $details->execute($ids);
        $itemsByOrder = [];
        foreach ($details->fetchAll() as $item) {
            $itemsByOrder[$item['pedido_id']][] = $this->normaliseLine($item);
        }

        $history = $this->db->prepare(
            "SELECT pedido_id, estado, nota, created_at FROM historial_pedido
             WHERE pedido_id IN ({$placeholders}) ORDER BY id"
        );
        $history->execute($ids);
        $historyByOrder = [];
        foreach ($history->fetchAll() as $entry) {
            $historyByOrder[$entry['pedido_id']][] = [
                'status' => $entry['estado'],
                'at' => $this->isoDate($entry['created_at']),
                'note' => $entry['nota'] ?? '',
            ];
        }

        return array_map(function (array $order) use ($itemsByOrder, $historyByOrder): array {
            return $this->normaliseOrder(
                $order,
                $itemsByOrder[$order['id']] ?? [],
                $historyByOrder[$order['id']] ?? []
            );
        }, $orders);
    }

    public function sales(int $limit = 80): array
    {
        $statement = $this->db->prepare(
            'SELECT v.id, v.folio, v.metodo_pago, v.subtotal, v.total, v.created_at, u.nombre AS cashier
             FROM ventas v INNER JOIN usuarios u ON u.id = v.usuario_id
             ORDER BY v.id DESC LIMIT :limit'
        );
        $statement->bindValue('limit', $limit, PDO::PARAM_INT);
        $statement->execute();
        $sales = $statement->fetchAll();
        if (!$sales) {
            return [];
        }

        $ids = array_column($sales, 'id');
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $details = $this->db->prepare(
            "SELECT venta_id, producto_id, codigo_barras, producto_nombre, cantidad, precio_unitario, total_linea
             FROM venta_detalles WHERE venta_id IN ({$placeholders}) ORDER BY id"
        );
        $details->execute($ids);
        $itemsBySale = [];
        foreach ($details->fetchAll() as $item) {
            $itemsBySale[$item['venta_id']][] = $this->normaliseLine($item);
        }

        return array_map(function (array $sale) use ($itemsBySale): array {
            return [
                'id' => $sale['folio'],
                'created_at' => $this->isoDate($sale['created_at']),
                'items' => $itemsBySale[$sale['id']] ?? [],
                'subtotal' => (float) $sale['subtotal'],
                'total' => (float) $sale['total'],
                'payment_method' => $sale['metodo_pago'],
                'cashier' => $sale['cashier'],
            ];
        }, $sales);
    }

    public function track(string $folio, string $token): ?array
    {
        if ($folio === '' || $token === '') {
            return null;
        }

        $statement = $this->db->prepare(
            'SELECT id, folio, cliente_nombre, cliente_email, cliente_telefono, tipo_entrega,
                    destino, estado, paqueteria, numero_guia, nota_entrega, subtotal, envio,
                    total, entregado_en, verificado_en, created_at, updated_at
             FROM pedidos WHERE folio = :folio AND tracking_token_hash = :token_hash LIMIT 1'
        );
        $statement->execute([
            'folio' => $folio,
            'token_hash' => hash('sha256', $token),
        ]);
        $order = $statement->fetch();
        if (!$order) {
            return null;
        }

        return $this->loadOrder((int) $order['id']);
    }

    public function saveProduct(array $input, int $userId): array
    {
        $name = $this->clean($input['name'] ?? '', 160);
        $category = $this->clean($input['category'] ?? 'Medicamentos', 120) ?: 'Medicamentos';
        $barcode = preg_replace('/\s+/', '', (string) ($input['barcode'] ?? ''));
        $price = round((float) ($input['price'] ?? 0), 2);
        $stock = filter_var($input['stock'] ?? 0, FILTER_VALIDATE_INT);
        $minStock = filter_var($input['min_stock'] ?? 5, FILTER_VALIDATE_INT);
        $id = filter_var($input['id'] ?? 0, FILTER_VALIDATE_INT);
        $emoji = $this->clean($input['emoji'] ?? '💊', 16) ?: '💊';

        if ($name === '' || $price < 0 || $stock === false || $stock < 0 || $minStock === false || $minStock < 0 || $id === false || $id < 0) {
            return ['status' => 422, 'data' => ['error' => 'Revisa el nombre, precio y existencias.']];
        }
        if ($barcode !== '' && !preg_match('/^[A-Za-z0-9-]{6,32}$/', $barcode)) {
            return ['status' => 422, 'data' => ['error' => 'El código debe tener entre 6 y 32 caracteres.']];
        }

        try {
            $this->db->beginTransaction();
            if ($id > 0) {
                $find = $this->db->prepare('SELECT stock, codigo_barras FROM productos WHERE id = :id FOR UPDATE');
                $find->execute(['id' => $id]);
                $current = $find->fetch();
                if (!$current) {
                    $this->db->rollBack();
                    return ['status' => 404, 'data' => ['error' => 'No encontramos el producto.']];
                }
                if ($barcode === '') {
                    $barcode = (string) $current['codigo_barras'];
                }
                if (!$this->barcodeAvailable($barcode, $id)) {
                    $this->db->rollBack();
                    return ['status' => 409, 'data' => ['error' => 'Ese código de barras ya está asignado a otro producto.']];
                }

                $update = $this->db->prepare(
                    'UPDATE productos SET codigo_barras = :barcode, nombre = :name, categoria = :category,
                         emoji = :emoji, precio = :price, stock = :stock, stock_minimo = :min_stock
                     WHERE id = :id'
                );
                $update->execute([
                    'barcode' => $barcode !== '' ? $barcode : null,
                    'name' => $name,
                    'category' => $category,
                    'emoji' => $emoji,
                    'price' => $price,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                    'id' => $id,
                ]);
                $delta = $stock - (int) $current['stock'];
                if ($delta !== 0) {
                    $this->recordMovement($id, $delta, 'ajuste', 'Ajuste desde inventario de farmacia', $userId);
                }
            } else {
                if ($barcode !== '' && !$this->barcodeAvailable($barcode)) {
                    $this->db->rollBack();
                    return ['status' => 409, 'data' => ['error' => 'Ese código de barras ya está asignado a otro producto.']];
                }
                $insert = $this->db->prepare(
                    'INSERT INTO productos (sku, codigo_barras, nombre, categoria, emoji, precio, stock, stock_minimo, activo)
                     VALUES (NULL, :barcode, :name, :category, :emoji, :price, :stock, :min_stock, 1)'
                );
                $insert->execute([
                    'barcode' => $barcode !== '' ? $barcode : null,
                    'name' => $name,
                    'category' => $category,
                    'emoji' => $emoji,
                    'price' => $price,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                ]);
                $id = (int) $this->db->lastInsertId();
                $sku = $this->generateSku($id);
                $setSku = $this->db->prepare('UPDATE productos SET sku = :sku WHERE id = :id');
                $setSku->execute(['sku' => $sku, 'id' => $id]);
                if ($barcode === '') {
                    $barcode = $this->generateBarcode($id);
                    $setBarcode = $this->db->prepare('UPDATE productos SET codigo_barras = :barcode WHERE id = :id');
                    $setBarcode->execute(['barcode' => $barcode, 'id' => $id]);
                }
                if ($stock > 0) {
                    $this->recordMovement($id, $stock, 'entrada', 'Stock inicial', $userId);
                }
            }

            $this->db->commit();
            $product = $this->productById($id);

            return [
                'status' => (int) ($input['id'] ?? 0) > 0 ? 200 : 201,
                'data' => ['product' => $product, 'products' => $this->products()],
            ];
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    public function createSale(array $input, int $userId): array
    {
        $items = $this->normaliseItems($input['items'] ?? []);
        if (!$items) {
            return ['status' => 422, 'data' => ['error' => 'Agrega al menos un producto a la venta.']];
        }

        try {
            $this->db->beginTransaction();
            $matched = $this->lockProducts($items);
            if (isset($matched['error'])) {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => $matched['error'], 'unknown' => $matched['unknown'] ?? []]];
            }

            $saleItems = [];
            $total = 0.0;
            foreach ($matched as $line) {
                $product = $line['product'];
                $quantity = $line['quantity'];
                if ((int) $product['stock'] < $quantity) {
                    $this->db->rollBack();
                    return ['status' => 409, 'data' => ['error' => 'Existencias insuficientes para ' . $product['nombre'] . '.']];
                }
                $lineTotal = round((float) $product['precio'] * $quantity, 2);
                $total += $lineTotal;
                $saleItems[] = [
                    'product_id' => (int) $product['id'],
                    'barcode' => $product['codigo_barras'],
                    'name' => $product['nombre'],
                    'quantity' => $quantity,
                    'price' => (float) $product['precio'],
                    'total' => $lineTotal,
                ];
            }

            $folio = 'V-' . gmdate('Ymd-His') . '-' . strtoupper(bin2hex(random_bytes(3)));
            $payment = $this->clean($input['payment_method'] ?? 'efectivo', 30) ?: 'efectivo';
            $sale = $this->insertSale($folio, $userId, $payment, $total, $saleItems);
            foreach ($matched as $line) {
                $this->changeStock((int) $line['product']['id'], -$line['quantity']);
                $this->recordMovement((int) $line['product']['id'], -$line['quantity'], 'salida', 'Venta ' . $folio, $userId);
            }
            $this->db->commit();

            return ['status' => 201, 'data' => ['sale' => $sale, 'products' => $this->products()]];
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    public function createOnlineOrder(array $input): array
    {
        $items = $this->normaliseItems($input['items'] ?? []);
        if (!$items) {
            return ['status' => 422, 'data' => ['error' => 'El carrito no contiene productos.']];
        }

        $name = $this->clean($input['customer_name'] ?? '', 120);
        $email = strtolower($this->clean($input['customer_email'] ?? '', 160));
        $phone = $this->clean($input['customer_phone'] ?? '', 40);
        $delivery = ($input['delivery_type'] ?? 'envio') === 'recoger' ? 'recoger' : 'envio';
        $destination = $this->clean($input['destination'] ?? '', 300);
        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => 422, 'data' => ['error' => 'Escribe tu nombre y un correo válido para registrar el pedido.']];
        }
        if ($delivery === 'envio' && $destination === '') {
            return ['status' => 422, 'data' => ['error' => 'Escribe la dirección de entrega.']];
        }

        try {
            $this->db->beginTransaction();
            $matched = $this->lockProducts($items);
            if (isset($matched['error'])) {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => $matched['error'], 'unknown' => $matched['unknown'] ?? []]];
            }

            $orderItems = [];
            $subtotal = 0.0;
            foreach ($matched as $line) {
                $product = $line['product'];
                $quantity = $line['quantity'];
                if ((int) $product['stock'] < $quantity) {
                    $this->db->rollBack();
                    return ['status' => 409, 'data' => ['error' => $product['nombre'] . ' no tiene existencias suficientes.']];
                }
                $lineTotal = round((float) $product['precio'] * $quantity, 2);
                $subtotal += $lineTotal;
                $orderItems[] = [
                    'product_id' => (int) $product['id'],
                    'barcode' => $product['codigo_barras'],
                    'name' => $product['nombre'],
                    'quantity' => $quantity,
                    'price' => (float) $product['precio'],
                    'total' => $lineTotal,
                ];
            }

            $folio = 'CB-' . gmdate('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
            $token = bin2hex(random_bytes(16));
            $shipping = $delivery === 'recoger' || $subtotal >= 500 ? 0.00 : 90.00;
            $insert = $this->db->prepare(
                "INSERT INTO pedidos
                    (folio, tracking_token_hash, cliente_nombre, cliente_email, cliente_telefono,
                     tipo_entrega, destino, estado, subtotal, envio, total)
                 VALUES (:folio, :token_hash, :name, :email, :phone, :delivery, :destination,
                         'recibido', :subtotal, :shipping, :total)"
            );
            $insert->execute([
                'folio' => $folio,
                'token_hash' => hash('sha256', $token),
                'name' => $name,
                'email' => $email,
                'phone' => $phone ?: null,
                'delivery' => $delivery,
                'destination' => $destination ?: null,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $subtotal + $shipping,
            ]);
            $orderId = (int) $this->db->lastInsertId();
            $this->insertOrderItems($orderId, $orderItems);
            $this->addOrderHistory($orderId, null, 'recibido', 'Pedido recibido en farmacia.');

            foreach ($matched as $line) {
                $this->changeStock((int) $line['product']['id'], -$line['quantity']);
                $this->recordMovement((int) $line['product']['id'], -$line['quantity'], 'salida', 'Pedido en línea ' . $folio, null);
            }
            $this->db->commit();

            return [
                'status' => 201,
                'data' => ['order' => $this->loadOrder($orderId), 'tracking_token' => $token],
            ];
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    public function updateOrder(array $input, int $userId): array
    {
        $folio = $this->clean($input['id'] ?? '', 40);
        $status = $this->clean($input['status'] ?? '', 40);
        $allowed = ['recibido','preparando','listo','enviado','en_transito','entregado','verificado','cancelado'];
        if (!in_array($status, $allowed, true)) {
            return ['status' => 422, 'data' => ['error' => 'Estado de pedido no válido.']];
        }

        try {
            $this->db->beginTransaction();
            $find = $this->db->prepare('SELECT * FROM pedidos WHERE folio = :folio LIMIT 1 FOR UPDATE');
            $find->execute(['folio' => $folio]);
            $order = $find->fetch();
            if (!$order) {
                $this->db->rollBack();
                return ['status' => 404, 'data' => ['error' => 'No encontramos ese pedido.']];
            }
            $current = (string) $order['estado'];
            if ($current === 'cancelado') {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => 'Un pedido cancelado no se puede modificar.']];
            }
            if ($status === 'cancelado' && in_array($current, ['enviado','en_transito','entregado','verificado'], true)) {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => 'No se puede cancelar un pedido que ya salió para entrega.']];
            }
            if ($status === 'en_transito' && $current !== 'enviado') {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => 'Registra primero la paquetería y la guía para marcarlo en tránsito.']];
            }
            if ($status === 'entregado' && !in_array($current, ['enviado','en_transito','listo'], true)) {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => 'Marca el pedido como enviado o listo antes de confirmar la entrega.']];
            }
            if ($status === 'verificado' && $current !== 'entregado') {
                $this->db->rollBack();
                return ['status' => 409, 'data' => ['error' => 'Primero confirma que el pedido fue entregado; después verifica la recepción en destino.']];
            }

            $carrier = $this->clean($input['carrier'] ?? $order['paqueteria'] ?? '', 80);
            $tracking = $this->clean($input['tracking_number'] ?? $order['numero_guia'] ?? '', 80);
            $note = $this->clean($input['delivery_note'] ?? $order['nota_entrega'] ?? '', 300);
            if ($status === 'enviado' && $order['tipo_entrega'] === 'envio' && ($tracking === '' || $carrier === '')) {
                $this->db->rollBack();
                return ['status' => 422, 'data' => ['error' => 'Captura la paquetería y el número de guía antes de marcarlo como enviado.']];
            }
            if ($status === 'verificado' && $note === '') {
                $this->db->rollBack();
                return ['status' => 422, 'data' => ['error' => 'Anota cómo confirmaste la recepción en destino.']];
            }

            if ($status === 'cancelado') {
                $items = $this->db->prepare('SELECT producto_id, cantidad FROM pedido_detalles WHERE pedido_id = :id');
                $items->execute(['id' => $order['id']]);
                foreach ($items->fetchAll() as $item) {
                    if ($item['producto_id'] === null) {
                        continue;
                    }
                    $this->changeStock((int) $item['producto_id'], (int) $item['cantidad']);
                    $this->recordMovement((int) $item['producto_id'], (int) $item['cantidad'], 'entrada', 'Cancelación de pedido ' . $folio, $userId);
                }
            }

            $update = $this->db->prepare(
                'UPDATE pedidos SET estado = :status, paqueteria = :carrier, numero_guia = :tracking,
                    nota_entrega = :note,
                    entregado_en = CASE WHEN :delivered_status IN (\'entregado\', \'verificado\') THEN COALESCE(entregado_en, UTC_TIMESTAMP()) ELSE entregado_en END,
                    verificado_en = CASE WHEN :verified_status = \'verificado\' THEN UTC_TIMESTAMP() ELSE verificado_en END
                 WHERE id = :id'
            );
            $update->execute([
                'status' => $status,
                'carrier' => $carrier ?: null,
                'tracking' => $tracking ?: null,
                'note' => $note ?: null,
                'delivered_status' => $status,
                'verified_status' => $status,
                'id' => $order['id'],
            ]);
            $this->addOrderHistory((int) $order['id'], $userId, $status, $note);
            $this->db->commit();

            return ['status' => 200, 'data' => ['order' => $this->loadOrder((int) $order['id']), 'products' => $this->products()]];
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    private function lockProducts(array $items): array
    {
        $find = $this->db->prepare('SELECT id, codigo_barras, nombre, precio, stock FROM productos WHERE codigo_barras = :barcode AND activo = 1 FOR UPDATE');
        $matched = [];
        $unknown = [];
        foreach ($items as $item) {
            $find->execute(['barcode' => $item['barcode']]);
            $product = $find->fetch();
            if (!$product) {
                $unknown[] = $item['barcode'];
                continue;
            }
            $matched[] = ['product' => $product, 'quantity' => $item['quantity']];
        }
        if ($unknown) {
            return [
                'error' => 'Hay códigos que farmacia todavía no tiene registrados. Pide que los agreguen al inventario e inténtalo de nuevo.',
                'unknown' => $unknown,
            ];
        }

        return $matched;
    }

    private function insertSale(string $folio, int $userId, string $payment, float $total, array $items): array
    {
        $insert = $this->db->prepare(
            'INSERT INTO ventas (folio, usuario_id, metodo_pago, subtotal, total)
             VALUES (:folio, :user_id, :payment, :subtotal, :total)'
        );
        $insert->execute(['folio' => $folio, 'user_id' => $userId, 'payment' => $payment, 'subtotal' => $total, 'total' => $total]);
        $saleId = (int) $this->db->lastInsertId();
        $details = $this->db->prepare(
            'INSERT INTO venta_detalles (venta_id, producto_id, codigo_barras, producto_nombre, cantidad, precio_unitario, total_linea)
             VALUES (:sale_id, :product_id, :barcode, :name, :quantity, :price, :line_total)'
        );
        foreach ($items as $item) {
            $details->execute([
                'sale_id' => $saleId,
                'product_id' => $item['product_id'],
                'barcode' => $item['barcode'],
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'line_total' => $item['total'],
            ]);
        }
        $date = $this->db->query('SELECT UTC_TIMESTAMP()')->fetchColumn();

        return [
            'id' => $folio,
            'created_at' => $this->isoDate((string) $date),
            'items' => array_map(static function (array $item): array {
                unset($item['product_id']);
                return $item;
            }, $items),
            'subtotal' => $total,
            'total' => $total,
            'payment_method' => $payment,
            'cashier' => (string) ($_SESSION['user']['name'] ?? 'Personal de farmacia'),
        ];
    }

    private function insertOrderItems(int $orderId, array $items): void
    {
        $insert = $this->db->prepare(
            'INSERT INTO pedido_detalles (pedido_id, producto_id, codigo_barras, producto_nombre, cantidad, precio_unitario, total_linea)
             VALUES (:order_id, :product_id, :barcode, :name, :quantity, :price, :line_total)'
        );
        foreach ($items as $item) {
            $insert->execute([
                'order_id' => $orderId,
                'product_id' => $item['product_id'],
                'barcode' => $item['barcode'],
                'name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'line_total' => $item['total'],
            ]);
        }
    }

    private function loadOrder(int $id): ?array
    {
        $statement = $this->db->prepare(
            'SELECT id, folio, cliente_nombre, cliente_email, cliente_telefono, tipo_entrega,
                    destino, estado, paqueteria, numero_guia, nota_entrega, subtotal, envio,
                    total, entregado_en, verificado_en, created_at, updated_at
             FROM pedidos WHERE id = :id LIMIT 1'
        );
        $statement->execute(['id' => $id]);
        $order = $statement->fetch();
        if (!$order) {
            return null;
        }
        $items = $this->db->prepare(
            'SELECT pedido_id, producto_id, codigo_barras, producto_nombre, cantidad, precio_unitario, total_linea
             FROM pedido_detalles WHERE pedido_id = :id ORDER BY id'
        );
        $items->execute(['id' => $id]);
        $history = $this->db->prepare(
            'SELECT estado, nota, created_at FROM historial_pedido WHERE pedido_id = :id ORDER BY id'
        );
        $history->execute(['id' => $id]);
        $historyRows = array_map(fn(array $entry): array => [
            'status' => $entry['estado'],
            'at' => $this->isoDate($entry['created_at']),
            'note' => $entry['nota'] ?? '',
        ], $history->fetchAll());

        return $this->normaliseOrder($order, array_map([$this, 'normaliseLine'], $items->fetchAll()), $historyRows);
    }

    private function normaliseOrder(array $row, array $items, array $history): array
    {
        return [
            'id' => $row['folio'],
            'created_at' => $this->isoDate($row['created_at']),
            'updated_at' => $this->isoDate($row['updated_at']),
            'customer_name' => $row['cliente_nombre'],
            'customer_email' => $row['cliente_email'],
            'customer_phone' => $row['cliente_telefono'] ?? '',
            'delivery_type' => $row['tipo_entrega'],
            'destination' => $row['destino'] ?? '',
            'status' => $row['estado'],
            'carrier' => $row['paqueteria'] ?? '',
            'tracking_number' => $row['numero_guia'] ?? '',
            'delivery_note' => $row['nota_entrega'] ?? '',
            'history' => $history,
            'items' => $items,
            'subtotal' => (float) $row['subtotal'],
            'shipping' => (float) $row['envio'],
            'total' => (float) $row['total'],
            'delivered_at' => $row['entregado_en'] ? $this->isoDate($row['entregado_en']) : null,
            'destination_verified_at' => $row['verificado_en'] ? $this->isoDate($row['verificado_en']) : null,
        ];
    }

    private function normaliseLine(array $row): array
    {
        return [
            'id' => (int) ($row['producto_id'] ?? 0),
            'barcode' => $row['codigo_barras'] ?? '',
            'name' => $row['producto_nombre'],
            'quantity' => (int) $row['cantidad'],
            'price' => (float) $row['precio_unitario'],
            'total' => (float) $row['total_linea'],
        ];
    }

    private function normaliseProduct(array $row): array
    {
        $row['id'] = (int) $row['id'];
        $row['barcode'] = (string) ($row['barcode'] ?? '');
        $row['price'] = (float) $row['price'];
        $row['stock'] = (int) $row['stock'];
        $row['min_stock'] = (int) $row['min_stock'];
        $row['emoji'] = $row['emoji'] ?: '💊';

        return $row;
    }

    private function productById(int $id): ?array
    {
        $statement = $this->db->prepare(
            'SELECT id, sku, codigo_barras AS barcode, nombre AS name, categoria AS category,
                    precio AS price, stock, stock_minimo AS min_stock, emoji
             FROM productos WHERE id = :id LIMIT 1'
        );
        $statement->execute(['id' => $id]);
        $product = $statement->fetch();

        return $product ? $this->normaliseProduct($product) : null;
    }

    private function barcodeAvailable(string $barcode, ?int $exceptId = null): bool
    {
        if ($barcode === '') {
            return true;
        }
        $sql = 'SELECT id FROM productos WHERE codigo_barras = :barcode';
        $parameters = ['barcode' => $barcode];
        if ($exceptId !== null) {
            $sql .= ' AND id <> :except_id';
            $parameters['except_id'] = $exceptId;
        }
        $statement = $this->db->prepare($sql . ' LIMIT 1');
        $statement->execute($parameters);

        return $statement->fetchColumn() === false;
    }

    private function generateBarcode(int $id): string
    {
        for ($candidate = $id; $candidate < $id + 1000; $candidate++) {
            $base = '200' . str_pad((string) $candidate, 9, '0', STR_PAD_LEFT);
            $sum = 0;
            for ($index = 0; $index < 12; $index++) {
                $sum += (int) $base[$index] * ($index % 2 === 0 ? 1 : 3);
            }
            $barcode = $base . ((10 - $sum % 10) % 10);
            if ($this->barcodeAvailable($barcode)) {
                return $barcode;
            }
        }

        throw new DomainException('No se pudo generar un código de barras único para el producto.');
    }

    private function generateSku(int $id): string
    {
        $sku = 'FAR-' . str_pad((string) $id, 6, '0', STR_PAD_LEFT);
        $statement = $this->db->prepare('SELECT 1 FROM productos WHERE sku = :sku LIMIT 1');
        $statement->execute(['sku' => $sku]);
        if ($statement->fetchColumn() !== false) {
            $sku .= '-' . strtoupper(bin2hex(random_bytes(2)));
        }

        return $sku;
    }

    private function changeStock(int $productId, int $delta): void
    {
        $statement = $this->db->prepare(
            'UPDATE productos SET stock = stock + :delta
             WHERE id = :id AND (:is_increase = 1 OR stock >= :required_stock)'
        );
        $statement->execute([
            'delta' => $delta,
            'id' => $productId,
            'is_increase' => $delta >= 0 ? 1 : 0,
            'required_stock' => abs($delta),
        ]);
        if ($statement->rowCount() !== 1) {
            throw new DomainException('No se pudo actualizar el inventario; revisa las existencias del producto.');
        }
    }

    private function recordMovement(int $productId, int $quantity, string $type, string $reason, ?int $userId): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, motivo)
             VALUES (:product_id, :user_id, :type, :quantity, :reason)'
        );
        $statement->execute([
            'product_id' => $productId,
            'user_id' => $userId,
            'type' => $type,
            'quantity' => $quantity,
            'reason' => $reason,
        ]);
    }

    private function addOrderHistory(int $orderId, ?int $userId, string $status, string $note): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO historial_pedido (pedido_id, usuario_id, estado, nota)
             VALUES (:order_id, :user_id, :status, :note)'
        );
        $statement->execute([
            'order_id' => $orderId,
            'user_id' => $userId,
            'status' => $status,
            'note' => $note ?: null,
        ]);
    }

    private function normaliseItems($items): array
    {
        if (!is_array($items)) {
            return [];
        }
        $normalised = [];
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $barcode = preg_replace('/\s+/', '', (string) ($item['barcode'] ?? ''));
            if ($barcode === '' || !preg_match('/^[A-Za-z0-9-]{6,32}$/', $barcode)) {
                continue;
            }
            $quantity = max(1, min(999, (int) ($item['quantity'] ?? 1)));
            if (!isset($normalised[$barcode])) {
                $normalised[$barcode] = ['barcode' => $barcode, 'quantity' => 0];
            }
            $normalised[$barcode]['quantity'] += $quantity;
        }

        return array_values($normalised);
    }

    private function clean($value, int $limit): string
    {
        return mb_substr(trim(strip_tags((string) $value)), 0, $limit, 'UTF-8');
    }

    private function isoDate(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return gmdate('Y-m-d\TH:i:s\Z', strtotime($value . (str_contains($value, 'Z') ? '' : ' UTC')));
    }
}
