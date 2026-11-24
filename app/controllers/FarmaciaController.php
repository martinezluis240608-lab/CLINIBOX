<?php

namespace App\Controllers;

use App\Core\Controller;

/** Punto de venta de farmacia y API de inventario/pedidos. */
class FarmaciaController extends Controller
{
    private string $dataFile;

    public function __construct()
    {
        $this->dataFile = APP_PATH . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'farmacia.json';
    }

    /** Muestra el punto de venta solo a personal autenticado de farmacia. */
    public function index(): void
    {
        if (!$this->isStaff()) {
            $this->redirect('/login');
        }

        $this->view('tienda/farmacia');
    }

    /** Recibe operaciones JSON del POS y devuelve el resultado al navegador. */
    public function api(): void
    {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, private');

        try {
            if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
                $this->getApi();
                return;
            }

            $payload = json_decode(file_get_contents('php://input') ?: '{}', true);
            if (!is_array($payload)) {
                $this->json(['error' => 'La solicitud no contiene JSON válido.'], 400);
                return;
            }

            $action = (string) ($payload['action'] ?? '');
            if ($action === 'online_order') {
                $result = $this->createOnlineOrder($payload);
                $this->json($result['data'], $result['status']);
                return;
            }

            if (!$this->isStaff()) {
                $this->json(['error' => 'Inicia sesión como personal de farmacia para continuar.'], 401);
                return;
            }

            if ($action === 'sale') {
                $result = $this->createSale($payload);
            } elseif ($action === 'save_product') {
                $result = $this->saveProduct($payload);
            } elseif ($action === 'update_order') {
                $result = $this->updateOrder($payload);
            } else {
                $this->json(['error' => 'Acción no reconocida.'], 400);
                return;
            }

            $this->json($result['data'], $result['status']);
        } catch (\Throwable $error) {
            $this->json(['error' => 'No se pudo completar la operación de farmacia.'], 500);
        }
    }

    /** Atiende consultas de productos, pedidos, ventas y seguimiento público. */
    private function getApi(): void
    {
        $resource = (string) ($_GET['resource'] ?? 'products');

        if ($resource === 'tracking') {
            $id = (string) ($_GET['id'] ?? '');
            $token = (string) ($_GET['token'] ?? '');
            $order = $this->readData()['orders'];
            foreach ($order as $record) {
                if (($record['id'] ?? '') === $id && $token !== '' && hash_equals((string) ($record['tracking_token'] ?? ''), $token)) {
                    $this->json(['order' => $this->publicOrder($record)]);
                    return;
                }
            }
            $this->json(['error' => 'No encontramos ese pedido. Revisa el folio y el código de seguimiento.'], 404);
            return;
        }

        if ($resource === 'products') {
            $data = $this->readData();
            $products = array_map(static function (array $product): array {
                return [
                    'id' => $product['id'],
                    'barcode' => $product['barcode'],
                    'name' => $product['name'],
                    'category' => $product['category'],
                    'price' => (float) $product['price'],
                    'stock' => (int) $product['stock'],
                    'min_stock' => (int) $product['min_stock'],
                    'emoji' => $product['emoji'] ?? '💊',
                ];
            }, $data['products']);
            $this->json(['products' => $products]);
            return;
        }

        if (!$this->isStaff()) {
            $this->json(['error' => 'Inicia sesión para consultar esta información.'], 401);
            return;
        }

        $data = $this->readData();
        if ($resource === 'orders') {
            $orders = array_map([$this, 'publicOrder'], array_reverse($data['orders']));
            $this->json(['orders' => $orders]);
            return;
        }
        if ($resource === 'sales') {
            $this->json(['sales' => array_slice(array_reverse($data['sales']), 0, 80)]);
            return;
        }

        $this->json(['error' => 'Recurso no reconocido.'], 404);
    }

    /** Valida existencias, registra una venta y descuenta las unidades cobradas. */
    private function createSale(array $payload): array
    {
        return $this->mutateData(function (array &$data) use ($payload): array {
            $items = $this->normaliseItems($payload['items'] ?? []);
            if (!$items) {
                return ['status' => 422, 'data' => ['error' => 'Agrega al menos un producto a la venta.']];
            }

            $matched = $this->resolveItems($data, $items, false);
            if (isset($matched['error'])) {
                return ['status' => 409, 'data' => ['error' => $matched['error'], 'unknown' => $matched['unknown'] ?? []]];
            }

            foreach ($matched as $line) {
                if ((int) $line['product']['stock'] < $line['quantity']) {
                    return ['status' => 409, 'data' => ['error' => 'Existencias insuficientes para ' . $line['product']['name'] . '.']];
                }
            }

            $total = 0.0;
            $saleItems = [];
            foreach ($matched as $line) {
                $index = $this->productIndex($data['products'], $line['product']['id']);
                $data['products'][$index]['stock'] -= $line['quantity'];
                $lineTotal = (float) $line['product']['price'] * $line['quantity'];
                $total += $lineTotal;
                $saleItems[] = [
                    'id' => $line['product']['id'],
                    'barcode' => $line['product']['barcode'],
                    'name' => $line['product']['name'],
                    'quantity' => $line['quantity'],
                    'price' => (float) $line['product']['price'],
                    'total' => $lineTotal,
                ];
            }

            $sale = [
                'id' => 'V-' . date('Ymd-His') . '-' . strtoupper(bin2hex(random_bytes(2))),
                'created_at' => date(DATE_ATOM),
                'items' => $saleItems,
                'total' => round($total, 2),
                'payment_method' => $this->clean($payload['payment_method'] ?? 'efectivo', 30),
                'cashier' => $_SESSION['user']['name'] ?? 'Personal de farmacia',
            ];
            $data['sales'][] = $sale;
            return ['status' => 201, 'data' => ['sale' => $sale, 'products' => $data['products']]];
        });
    }

    /** Crea o actualiza un producto, su código de barras y sus existencias. */
    private function saveProduct(array $payload): array
    {
        return $this->mutateData(function (array &$data) use ($payload): array {
            $id = (int) ($payload['id'] ?? 0);
            $name = $this->clean($payload['name'] ?? '', 140);
            $category = $this->clean($payload['category'] ?? 'Medicamentos', 80);
            $barcode = preg_replace('/\s+/', '', (string) ($payload['barcode'] ?? ''));
            $price = round((float) ($payload['price'] ?? 0), 2);
            $stock = (int) ($payload['stock'] ?? 0);
            $minStock = max(0, (int) ($payload['min_stock'] ?? 5));

            if ($name === '' || $price < 0 || $stock < 0) {
                return ['status' => 422, 'data' => ['error' => 'Revisa el nombre, precio y existencias.']];
            }
            if ($barcode === '') {
                $barcode = $this->nextBarcode($data['products']);
            }
            if (!preg_match('/^[A-Za-z0-9-]{6,32}$/', $barcode)) {
                return ['status' => 422, 'data' => ['error' => 'El código debe tener entre 6 y 32 caracteres.']];
            }

            foreach ($data['products'] as $index => $product) {
                if ((string) $product['barcode'] === $barcode && (int) $product['id'] !== $id) {
                    return ['status' => 409, 'data' => ['error' => 'Ese código de barras ya está asignado a otro producto.']];
                }
            }

            if ($id > 0) {
                $index = $this->productIndex($data['products'], $id);
                if ($index < 0) {
                    return ['status' => 404, 'data' => ['error' => 'No encontramos el producto.']];
                }
                $product = $data['products'][$index];
                $product['name'] = $name;
                $product['category'] = $category;
                $product['barcode'] = $barcode;
                $product['price'] = $price;
                $product['stock'] = $stock;
                $product['min_stock'] = $minStock;
                $product['updated_at'] = date(DATE_ATOM);
                $data['products'][$index] = $product;
            } else {
                $product = [
                    'id' => $this->nextProductId($data['products']),
                    'barcode' => $barcode,
                    'name' => $name,
                    'category' => $category,
                    'price' => $price,
                    'stock' => $stock,
                    'min_stock' => $minStock,
                    'emoji' => $this->clean($payload['emoji'] ?? '💊', 8),
                    'updated_at' => date(DATE_ATOM),
                ];
                $data['products'][] = $product;
            }

            return ['status' => $id > 0 ? 200 : 201, 'data' => ['product' => $product, 'products' => $data['products']]];
        });
    }

    /** Registra un pedido de tienda y reserva las unidades disponibles. */
    private function createOnlineOrder(array $payload): array
    {
        return $this->mutateData(function (array &$data) use ($payload): array {
            $items = $this->normaliseItems($payload['items'] ?? []);
            if (!$items) {
                return ['status' => 422, 'data' => ['error' => 'El carrito no contiene productos.']];
            }

            $customerName = $this->clean($payload['customer_name'] ?? '', 120);
            $customerEmail = strtolower($this->clean($payload['customer_email'] ?? '', 160));
            $customerPhone = $this->clean($payload['customer_phone'] ?? '', 40);
            $deliveryType = ($payload['delivery_type'] ?? 'envio') === 'recoger' ? 'recoger' : 'envio';
            $destination = $this->clean($payload['destination'] ?? '', 300);
            if ($customerName === '' || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                return ['status' => 422, 'data' => ['error' => 'Escribe tu nombre y un correo válido para registrar el pedido.']];
            }
            if ($deliveryType === 'envio' && $destination === '') {
                return ['status' => 422, 'data' => ['error' => 'Escribe la dirección de entrega.']];
            }

            $matched = $this->resolveItems($data, $items, true);
            if (isset($matched['error'])) {
                return ['status' => 409, 'data' => ['error' => $matched['error'], 'unknown' => $matched['unknown'] ?? []]];
            }
            foreach ($matched as $line) {
                if ((int) $line['product']['stock'] < $line['quantity']) {
                    return ['status' => 409, 'data' => ['error' => $line['product']['name'] . ' no tiene existencias suficientes.']];
                }
            }

            $subtotal = 0.0;
            $orderItems = [];
            foreach ($matched as $line) {
                $index = $this->productIndex($data['products'], $line['product']['id']);
                $data['products'][$index]['stock'] -= $line['quantity'];
                $lineTotal = (float) $line['product']['price'] * $line['quantity'];
                $subtotal += $lineTotal;
                $orderItems[] = [
                    'id' => $line['product']['id'],
                    'barcode' => $line['product']['barcode'],
                    'name' => $line['product']['name'],
                    'quantity' => $line['quantity'],
                    'price' => (float) $line['product']['price'],
                    'total' => $lineTotal,
                ];
            }

            $shipping = $deliveryType === 'recoger' || $subtotal >= 500 ? 0 : 90;
            $order = [
                'id' => 'CB-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3))),
                'tracking_token' => bin2hex(random_bytes(16)),
                'created_at' => date(DATE_ATOM),
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'customer_phone' => $customerPhone,
                'delivery_type' => $deliveryType,
                'destination' => $destination,
                'status' => 'recibido',
                'carrier' => '',
                'tracking_number' => '',
                'delivery_note' => '',
                'history' => [['status' => 'recibido', 'at' => date(DATE_ATOM), 'note' => 'Pedido recibido en farmacia.']],
                'items' => $orderItems,
                'subtotal' => round($subtotal, 2),
                'shipping' => $shipping,
                'total' => round($subtotal + $shipping, 2),
            ];
            $data['orders'][] = $order;
            return ['status' => 201, 'data' => ['order' => $this->publicOrder($order), 'tracking_token' => $order['tracking_token']]];
        });
    }

    /** Cambia el estado del pedido y registra datos de envío/entrega. */
    private function updateOrder(array $payload): array
    {
        return $this->mutateData(function (array &$data) use ($payload): array {
            $id = $this->clean($payload['id'] ?? '', 40);
            $status = $this->clean($payload['status'] ?? '', 40);
            $allowed = ['recibido', 'preparando', 'listo', 'enviado', 'en_transito', 'entregado', 'verificado', 'cancelado'];
            if (!in_array($status, $allowed, true)) {
                return ['status' => 422, 'data' => ['error' => 'Estado de pedido no válido.']];
            }
            foreach ($data['orders'] as $index => $order) {
                if (($order['id'] ?? '') !== $id) {
                    continue;
                }
                if (($order['status'] ?? '') === 'cancelado') {
                    return ['status' => 409, 'data' => ['error' => 'Un pedido cancelado no se puede modificar.']];
                }
                $currentStatus = (string) ($order['status'] ?? 'recibido');
                if ($status === 'cancelado' && in_array($currentStatus, ['enviado', 'en_transito', 'entregado', 'verificado'], true)) {
                    return ['status' => 409, 'data' => ['error' => 'No se puede cancelar un pedido que ya salió para entrega.']];
                }
                if ($status === 'en_transito' && $currentStatus !== 'enviado') {
                    return ['status' => 409, 'data' => ['error' => 'Registra primero la paquetería y la guía para marcarlo en tránsito.']];
                }
                if ($status === 'entregado' && !in_array($currentStatus, ['enviado', 'en_transito', 'listo'], true)) {
                    return ['status' => 409, 'data' => ['error' => 'Marca el pedido como enviado o listo antes de confirmar la entrega.']];
                }
                if ($status === 'verificado' && $currentStatus !== 'entregado') {
                    return ['status' => 409, 'data' => ['error' => 'Primero confirma que el pedido fue entregado; después verifica la recepción en destino.']];
                }
                if ($status === 'enviado' && ($order['delivery_type'] ?? '') === 'envio' && (trim((string) ($payload['tracking_number'] ?? '')) === '' || trim((string) ($payload['carrier'] ?? '')) === '')) {
                    return ['status' => 422, 'data' => ['error' => 'Captura la paquetería y el número de guía antes de marcarlo como enviado.']];
                }
                if ($status === 'verificado' && trim((string) ($payload['delivery_note'] ?? '')) === '') {
                    return ['status' => 422, 'data' => ['error' => 'Anota cómo confirmaste la recepción en destino.']];
                }
                if ($status === 'cancelado') {
                    foreach ($order['items'] as $item) {
                        $productIndex = $this->productIndex($data['products'], (int) $item['id']);
                        if ($productIndex >= 0) {
                            $data['products'][$productIndex]['stock'] += (int) $item['quantity'];
                        }
                    }
                }
                $order['status'] = $status;
                $order['carrier'] = $this->clean($payload['carrier'] ?? $order['carrier'] ?? '', 80);
                $order['tracking_number'] = $this->clean($payload['tracking_number'] ?? $order['tracking_number'] ?? '', 80);
                $order['delivery_note'] = $this->clean($payload['delivery_note'] ?? $order['delivery_note'] ?? '', 300);
                $order['updated_at'] = date(DATE_ATOM);
                $order['history'][] = ['status' => $status, 'at' => date(DATE_ATOM), 'note' => $order['delivery_note']];
                if ($status === 'verificado') {
                    $order['destination_verified_at'] = date(DATE_ATOM);
                }
                if ($status === 'entregado' || $status === 'verificado') {
                    $order['delivered_at'] = $order['delivered_at'] ?? date(DATE_ATOM);
                }
                $data['orders'][$index] = $order;
                return ['status' => 200, 'data' => ['order' => $this->publicOrder($order), 'products' => $data['products']]];
            }
            return ['status' => 404, 'data' => ['error' => 'No encontramos ese pedido.']];
        });
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
            if ($barcode !== '' && !preg_match('/^[A-Za-z0-9-]{6,32}$/', $barcode)) {
                continue;
            }
            $quantity = max(1, min(999, (int) ($item['quantity'] ?? 1)));
            if ($barcode !== '') {
                if (!isset($normalised[$barcode])) {
                    $normalised[$barcode] = [
                        'barcode' => $barcode,
                        'quantity' => 0,
                        'name' => $this->clean($item['name'] ?? '', 140),
                        'category' => $this->clean($item['category'] ?? 'Sin clasificar', 80),
                        'price' => max(0, (float) ($item['price'] ?? 0)),
                        'emoji' => $this->clean($item['emoji'] ?? '📦', 8),
                    ];
                }
                $normalised[$barcode]['quantity'] += $quantity;
            }
        }
        return array_values($normalised);
    }

    private function resolveItems(array &$data, array $items, bool $registerMissing): array
    {
        $matched = [];
        $unknown = [];
        foreach ($items as $item) {
            $found = null;
            foreach ($data['products'] as $product) {
                if ((string) $product['barcode'] === $item['barcode']) {
                    $found = $product;
                    break;
                }
            }
            if (!$found) {
                $unknown[] = $item['barcode'];
                if ($registerMissing) {
                    $data['products'][] = [
                        'id' => $this->nextProductId($data['products']),
                        'barcode' => $item['barcode'],
                        'name' => $item['name'] ?: 'Producto por registrar (' . $item['barcode'] . ')',
                        'category' => $item['category'] ?: 'Sin clasificar',
                        'price' => (float) ($item['price'] ?? 0),
                        'stock' => 0,
                        'min_stock' => 1,
                        'emoji' => $item['emoji'] ?: '📦',
                        'updated_at' => date(DATE_ATOM),
                    ];
                }
                continue;
            }
            $matched[] = ['product' => $found, 'quantity' => $item['quantity']];
        }
        if ($unknown) {
            return ['error' => 'Hay códigos que farmacia todavía no tiene registrados. Pide que los agreguen al inventario e inténtalo de nuevo.', 'unknown' => $unknown];
        }
        return $matched;
    }

    private function readData(): array
    {
        return $this->withData(function (array &$data) {
            return $data;
        });
    }

    private function mutateData(callable $callback): array
    {
        return $this->withData($callback);
    }

    /** Bloquea el archivo JSON durante lectura/escritura para evitar cruces de stock. */
    private function withData(callable $callback): array
    {
        $directory = dirname($this->dataFile);
        if (!is_dir($directory) && !mkdir($directory, 0770, true) && !is_dir($directory)) {
            throw new \RuntimeException('No se pudo preparar el almacenamiento de farmacia.');
        }
        $handle = fopen($this->dataFile, 'c+');
        if (!$handle) {
            throw new \RuntimeException('No se pudo abrir el almacenamiento de farmacia.');
        }
        flock($handle, LOCK_EX);
        rewind($handle);
        $raw = stream_get_contents($handle);
        $data = $raw ? json_decode($raw, true) : null;
        if ($raw === '') {
            $data = $this->seedData();
        } elseif (!is_array($data) || !isset($data['products'], $data['orders'], $data['sales'])) {
            flock($handle, LOCK_UN);
            fclose($handle);
            throw new \RuntimeException('El archivo de inventario de farmacia no es válido.');
        }
        $result = $callback($data);
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        return $result;
    }

    /** Catálogo inicial con códigos EAN internos; el stock parte en cero. */
    private function seedData(): array
    {
        $rows = [
            [1, '2000000000015', 'Paracetamol 500 mg', 'Medicamentos', 45, '💊'],
            [2, '2000000000022', 'Vitamina C 1000 mg', 'Vitaminas y suplementos', 120, '🍊'],
            [3, '2000000000039', 'Termómetro digital', 'Equipo médico', 85, '🌡️'],
            [4, '2000000000046', 'Gasas estériles', 'Primeros auxilios', 60, '▤'],
            [5, '2000000000053', 'Gel antibacterial', 'Higiene personal', 55, '🧴'],
            [6, '2000000000060', 'Protector solar FPS 50', 'Cuidado de la piel', 189, '☀️'],
            [7, '2000000000077', 'Ibuprofeno 400 mg', 'Medicamentos', 75, '💊'],
            [8, '2000000000084', 'Multivitamínico', 'Vitaminas y suplementos', 210, '💙'],
            [9, '2000000000091', 'Tensiómetro digital', 'Equipo médico', 549, '🩺'],
            [10, '2000000000107', 'Oxímetro de pulso', 'Equipo médico', 329, '🫀'],
            [11, '2000000000114', 'Kit de curación', 'Primeros auxilios', 149, '🩹'],
            [12, '2000000000121', 'Crema hidratante', 'Cuidado de la piel', 135, '🧴'],
        ];
        $products = [];
        foreach ($rows as [$id, $barcode, $name, $category, $price, $emoji]) {
            $products[] = ['id' => $id, 'barcode' => $barcode, 'name' => $name, 'category' => $category, 'price' => $price, 'stock' => 0, 'min_stock' => 5, 'emoji' => $emoji, 'updated_at' => date(DATE_ATOM)];
        }
        return ['products' => $products, 'orders' => [], 'sales' => []];
    }

    private function nextBarcode(array $products): string
    {
        $base = '200' . str_pad((string) ($this->nextProductId($products)), 9, '0', STR_PAD_LEFT);
        $sum = 0;
        for ($index = 0; $index < 12; $index++) {
            $sum += (int) $base[$index] * ($index % 2 === 0 ? 1 : 3);
        }
        return $base . ((10 - $sum % 10) % 10);
    }

    private function nextProductId(array $products): int
    {
        return $products ? max(array_map(static fn(array $product): int => (int) $product['id'], $products)) + 1 : 1;
    }

    private function productIndex(array $products, int $id): int
    {
        foreach ($products as $index => $product) {
            if ((int) $product['id'] === $id) {
                return $index;
            }
        }
        return -1;
    }

    /** Permite operar el POS a roles admin y farmacia. */
    private function isStaff(): bool
    {
        return in_array($_SESSION['user']['role'] ?? '', ['admin', 'farmacia'], true);
    }

    private function publicOrder(array $order): array
    {
        unset($order['tracking_token']);
        return $order;
    }

    private function clean($value, int $limit): string
    {
        return mb_substr(trim(strip_tags((string) $value)), 0, $limit, 'UTF-8');
    }

    private function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    }
}






