<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Pharmacy;
use Throwable;

/** Punto de venta y API de farmacia respaldados por MySQL. */
class FarmaciaController extends Controller
{
    public function index(): void
    {
        if (!$this->isStaff()) {
            $this->redirect('/login');
        }

        $this->view('tienda/farmacia');
    }

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
            if ($action !== 'online_order' && !$this->isStaff()) {
                $this->json(['error' => 'Inicia sesión como personal de farmacia para continuar.'], 401);
                return;
            }

            $pharmacy = new Pharmacy();
            if ($action === 'online_order') {
                $result = $pharmacy->createOnlineOrder($payload);
            } else {
                $userId = (int) (\auth_user()['id'] ?? 0);
                $result = match ($action) {
                    'sale' => $pharmacy->createSale($payload, $userId),
                    'save_product' => $pharmacy->saveProduct($payload, $userId),
                    'update_order' => $pharmacy->updateOrder($payload, $userId),
                    default => null,
                };
                if ($result === null) {
                    $this->json(['error' => 'Acción no reconocida.'], 400);
                    return;
                }
            }

            $this->json($result['data'], $result['status']);
        } catch (Throwable $error) {
            error_log('CliniBox pharmacy DB: ' . $error->getMessage());
            $this->json(['error' => 'No se pudo completar la operación de farmacia. Revisa la conexión a la base de datos e inténtalo de nuevo.'], 500);
        }
    }

    private function getApi(): void
    {
        $resource = (string) ($_GET['resource'] ?? 'products');
        if (!in_array($resource, ['tracking', 'products', 'staff', 'orders', 'sales'], true)) {
            $this->json(['error' => 'Recurso no reconocido.'], 404);
            return;
        }

        if (!in_array($resource, ['tracking', 'products'], true) && !$this->isStaff()) {
            $this->json(['error' => 'Inicia sesión para consultar esta información.'], 401);
            return;
        }

        $pharmacy = new Pharmacy();

        if ($resource === 'tracking') {
            $order = $pharmacy->track((string) ($_GET['id'] ?? ''), (string) ($_GET['token'] ?? ''));
            if (!$order) {
                $this->json(['error' => 'No encontramos ese pedido. Revisa el folio y el código de seguimiento.'], 404);
                return;
            }
            $this->json(['order' => $order]);
            return;
        }

        if ($resource === 'products') {
            $this->json(['products' => $pharmacy->products()]);
            return;
        }

        if ($resource === 'staff') {
            $staff = \auth_user() ?? [];
            $this->json([
                'name' => trim((string) ($staff['name'] ?? '')) ?: 'Farmacia',
                'role' => \auth_role(),
            ]);
            return;
        }
        if ($resource === 'orders') {
            $this->json(['orders' => $pharmacy->orders()]);
            return;
        }
        if ($resource === 'sales') {
            $this->json(['sales' => $pharmacy->sales()]);
            return;
        }

        $this->json(['error' => 'Recurso no reconocido.'], 404);
    }

    private function isStaff(): bool
    {
        return in_array($_SESSION['user']['role'] ?? '', ['admin', 'farmacia'], true);
    }

    private function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    }
}
