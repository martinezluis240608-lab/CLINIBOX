<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Product;
use App\Models\StoreOperations;
use App\Models\User;
use DomainException;
use PDOException;

class AdminController extends Controller
{
    public function index(): void
    {
        $this->requireRole(['admin']);
        $this->view('administador_tienda/index');
    }

    public function summary(): void
    {
        $this->requireRole(['admin']);
        $products = new Product();

        $this->respondJson([
            'stats' => $products->summary(),
            'lowStock' => $products->lowStock(),
            'csrfToken' => $this->csrfToken(),
            'adminName' => \auth_user()['name'] ?? 'Administrador',
            'success' => \flash('success'),
            'error' => \flash('error'),
        ]);
    }

    public function products(): void
    {
        $this->requireRole(['admin']);
        $this->view('administador_tienda/productos');
    }

    public function productsData(): void
    {
        $this->requireRole(['admin']);
        $products = new Product();
        $search = isset($_GET['buscar']) && is_string($_GET['buscar']) ? trim($_GET['buscar']) : '';
        $editingId = filter_var($_GET['editar'] ?? null, FILTER_VALIDATE_INT);

        $this->respondJson([
            'products' => $products->allWithStock($search),
            'editing' => $editingId !== false && $editingId > 0 ? $products->find($editingId) : null,
            'csrfToken' => $this->csrfToken(),
            'adminName' => \auth_user()['name'] ?? 'Administrador',
            'success' => \flash('success'),
            'error' => \flash('error'),
        ]);
    }

    public function saveProduct(): void
    {
        $this->requireRole(['admin']);
        $this->verifyCsrfToken();

        $id = filter_var($_POST['id'] ?? '0', FILTER_VALIDATE_INT);
        $name = $this->postString('nombre');
        $sku = $this->postString('sku');
        $category = $this->postString('categoria');
        $description = $this->postString('descripcion');
        $price = filter_var($_POST['precio'] ?? null, FILTER_VALIDATE_FLOAT);
        $minimumStock = filter_var($_POST['stock_minimo'] ?? null, FILTER_VALIDATE_INT);
        $initialStock = filter_var($_POST['stock_inicial'] ?? '0', FILTER_VALIDATE_INT);
        $isActive = isset($_POST['activo']) ? 1 : 0;

        if (
            $id === false || $id < 0 || $name === '' || strlen($name) > 160 ||
            $sku === '' || strlen($sku) > 60 || $category === '' || strlen($category) > 120 ||
            $price === false || $price < 0 || $minimumStock === false || $minimumStock < 0 ||
            $initialStock === false || $initialStock < 0 || ($id > 0 && $initialStock !== 0)
        ) {
            \set_flash('error', 'Revisa los datos: nombre, SKU, categoría, precio y existencias deben ser válidos.');
            $this->redirect('/admin/productos');
        }

        $product = [
            'id' => $id,
            'sku' => $sku,
            'nombre' => $name,
            'categoria' => $category,
            'descripcion' => $description,
            'precio' => $price,
            'stock_minimo' => $minimumStock,
            'activo' => $isActive,
        ];
        $model = new Product();

        try {
            if ($id > 0) {
                if (!$model->find($id)) {
                    \set_flash('error', 'El producto que intentas editar ya no existe.');
                    $this->redirect('/admin/productos');
                }

                $model->save($product);
            } else {
                $model->createWithStock($product, $initialStock, (int) \auth_user()['id']);
            }
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                \set_flash('error', 'Ese SKU ya está asignado a otro producto.');
                $this->redirect('/admin/productos');
            }

            throw $exception;
        }

        \set_flash('success', $id > 0 ? 'Producto actualizado.' : 'Producto creado.');
        $this->redirect('/admin/productos');
    }

    public function inventory(): void
    {
        $this->requireRole(['admin']);
        $this->view('administador_tienda/inventario');
    }

    public function inventoryData(): void
    {
        $this->requireRole(['admin']);
        $products = new Product();
        $allProducts = $products->allWithStock();
        $totalUnits = array_sum(array_map(static function (array $product): int {
            return (int) $product['stock'];
        }, $allProducts));
        $lowStockCount = count(array_filter($allProducts, static function (array $product): bool {
            return (int) $product['activo'] === 1 && (int) $product['stock'] <= (int) $product['stock_minimo'];
        }));

        $this->respondJson([
            'products' => $allProducts,
            'movements' => $products->movements(),
            'stats' => [
                'stock_units' => $totalUnits,
                'product_count' => count($allProducts),
                'low_stock_count' => $lowStockCount,
            ],
            'csrfToken' => $this->csrfToken(),
            'adminName' => \auth_user()['name'] ?? 'Administrador',
            'success' => \flash('success'),
            'error' => \flash('error'),
        ]);
    }

    public function adjustStock(): void
    {
        $this->requireRole(['admin']);
        $this->verifyCsrfToken();

        $productId = filter_var($_POST['producto_id'] ?? null, FILTER_VALIDATE_INT);
        $quantity = filter_var($_POST['cantidad'] ?? null, FILTER_VALIDATE_INT);
        $type = $this->postString('tipo');
        $reason = $this->postString('motivo');

        if (
            $productId === false || $productId < 1 || $quantity === false || $quantity < 0 ||
            !in_array($type, ['entrada', 'salida', 'ajuste'], true) ||
            ($type !== 'ajuste' && $quantity === 0) || $reason === '' || strlen($reason) > 255
        ) {
            \set_flash('error', 'Indica un movimiento válido, una cantidad y su motivo.');
            $this->redirect('/admin/inventario');
        }

        try {
            (new Product())->adjustStock($productId, $quantity, $type, $reason, (int) \auth_user()['id']);
        } catch (DomainException $exception) {
            \set_flash('error', $exception->getMessage());
            $this->redirect('/admin/inventario');
        }

        \set_flash('success', 'Inventario actualizado y movimiento registrado.');
        $this->redirect('/admin/inventario');
    }

    public function administrators(): void
    {
        $this->requireRole(['admin']);
        $this->view('administador_tienda/administradores');
    }

    public function administratorsData(): void
    {
        $this->requireRole(['admin']);

        $this->respondJson([
            'administrators' => (new User())->activeAdmins(),
            'csrfToken' => $this->csrfToken(),
            'adminName' => \auth_user()['name'] ?? 'Administrador',
            'success' => \flash('success'),
            'error' => \flash('error'),
        ]);
    }

    public function createAdministrator(): void
    {
        $this->requireRole(['admin']);
        $this->verifyCsrfToken();
        $name = $this->postString('nombre');
        $email = filter_var($this->postString('email'), FILTER_VALIDATE_EMAIL);
        $password = $_POST['password'] ?? '';

        if (
            $name === '' || strlen($name) > 120 || !$email || strlen($email) > 160 ||
            !is_string($password) || strlen($password) < 12
        ) {
            \set_flash('error', 'Escribe un nombre y correo válidos; la contraseña debe tener al menos 12 caracteres.');
            $this->redirect('/admin/administradores');
        }

        try {
            (new User())->createAdmin($name, $email, $password);
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                \set_flash('error', 'Ya existe una cuenta con ese correo.');
                $this->redirect('/admin/administradores');
            }

            throw $exception;
        }

        \set_flash('success', 'La cuenta de administrador fue creada.');
        $this->redirect('/admin/administradores');
    }

    public function setup(): void
    {
        $users = new User();

        if ($users->countActiveAdmins() > 0) {
            $this->redirect('/login');
        }

        $this->view('administador_tienda/configurar');
    }

    public function setupData(): void
    {
        if ((new User())->countActiveAdmins() > 0) {
            $this->redirect('/login');
        }

        $this->respondJson([
            'csrfToken' => $this->csrfToken(),
            'error' => \flash('error'),
        ]);
    }

    public function createFirstAdministrator(): void
    {
        $this->verifyCsrfToken();
        $users = new User();

        if ($users->countActiveAdmins() > 0) {
            $this->redirect('/login');
        }

        $name = $this->postString('nombre');
        $email = filter_var($this->postString('email'), FILTER_VALIDATE_EMAIL);
        $password = $_POST['password'] ?? '';
        $confirmation = $_POST['confirmar_password'] ?? '';

        if (
            $name === '' || strlen($name) > 120 || !$email || strlen($email) > 160 ||
            !is_string($password) || strlen($password) < 12 || $password !== $confirmation
        ) {
            \set_flash('error', 'Completa los datos y usa una contraseña de 12 caracteres o más que coincida con su confirmación.');
            $this->redirect('/admin/configurar');
        }

        try {
            $users->createAdmin($name, $email, $password);
        } catch (PDOException $exception) {
            if ($exception->getCode() === '23000') {
                \set_flash('error', 'Ese correo ya tiene una cuenta registrada.');
                $this->redirect('/admin/configurar');
            }

            throw $exception;
        }

        \set_flash('success', 'Administrador inicial creado. Ya puedes iniciar sesión.');
        $this->redirect('/login');
    }

    private function postString(string $field): string
    {
        $value = $_POST[$field] ?? '';

        return is_string($value) ? trim($value) : '';
    }

    private function respondJson(array $data): void
    {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_THROW_ON_ERROR);
    }
}
