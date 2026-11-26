<?php

namespace App\Models;

use DomainException;
use Throwable;

class Product extends Model
{
    protected string $table = 'productos';

    public function summary(): array
    {
        $statement = $this->db->query(
            'SELECT COUNT(*) AS product_count,
                    COALESCE(SUM(stock), 0) AS stock_units,
                    COALESCE(SUM(stock <= stock_minimo), 0) AS low_stock_count
             FROM productos WHERE activo = 1'
        );

        return $statement->fetch();
    }

    public function allWithStock(string $search = ''): array
    {
        $statement = $this->db->prepare(
            'SELECT id, sku, nombre, categoria, precio, stock, stock_minimo, activo
             FROM productos
             WHERE (:search = "" OR nombre LIKE :name_pattern OR sku LIKE :sku_pattern OR categoria LIKE :category_pattern)
             ORDER BY nombre'
        );
        $statement->execute([
            'search' => $search,
            'name_pattern' => '%' . $search . '%',
            'sku_pattern' => '%' . $search . '%',
            'category_pattern' => '%' . $search . '%',
        ]);

        return $statement->fetchAll();
    }

    public function lowStock(int $limit = 8): array
    {
        $statement = $this->db->prepare(
            'SELECT id, sku, nombre, stock, stock_minimo FROM productos
             WHERE activo = 1 AND stock <= stock_minimo ORDER BY stock ASC, nombre ASC LIMIT :limit'
        );
        $statement->bindValue('limit', $limit, \PDO::PARAM_INT);
        $statement->execute();

        return $statement->fetchAll();
    }

    public function movements(int $limit = 50): array
    {
        $statement = $this->db->prepare(
            'SELECT m.tipo, m.cantidad, m.motivo, m.created_at, p.nombre AS producto,
                    COALESCE(u.nombre, \'Pedido en línea\') AS usuario
             FROM movimientos_inventario m
             INNER JOIN productos p ON p.id = m.producto_id
             LEFT JOIN usuarios u ON u.id = m.usuario_id
             ORDER BY m.id DESC LIMIT :limit'
        );
        $statement->bindValue('limit', $limit, \PDO::PARAM_INT);
        $statement->execute();

        return $statement->fetchAll();
    }

    public function save(array $product): void
    {
        $statement = $this->db->prepare(
            'UPDATE productos
             SET sku = :sku, nombre = :nombre, categoria = :categoria, descripcion = :descripcion,
                 precio = :precio, stock_minimo = :stock_minimo, activo = :activo
             WHERE id = :id'
        );
        $statement->execute([
            'id' => $product['id'],
            'sku' => $product['sku'],
            'nombre' => $product['nombre'],
            'categoria' => $product['categoria'],
            'descripcion' => $product['descripcion'],
            'precio' => $product['precio'],
            'stock_minimo' => $product['stock_minimo'],
            'activo' => $product['activo'],
        ]);
    }

    public function createWithStock(array $product, int $initialStock, int $userId): void
    {
        $this->db->beginTransaction();

        try {
            $statement = $this->db->prepare(
                'INSERT INTO productos (sku, nombre, categoria, descripcion, precio, stock, stock_minimo, activo)
                 VALUES (:sku, :nombre, :categoria, :descripcion, :precio, :stock, :stock_minimo, :activo)'
            );
            $statement->execute([
                'sku' => $product['sku'],
                'nombre' => $product['nombre'],
                'categoria' => $product['categoria'],
                'descripcion' => $product['descripcion'],
                'precio' => $product['precio'],
                'stock' => $initialStock,
                'stock_minimo' => $product['stock_minimo'],
                'activo' => $product['activo'],
            ]);

            $productId = (int) $this->db->lastInsertId();

            $barcode = $this->generateBarcode($productId);
            $barcodeStatement = $this->db->prepare('UPDATE productos SET codigo_barras = :barcode WHERE id = :id');
            $barcodeStatement->execute(['barcode' => $barcode, 'id' => $productId]);

            if ($initialStock > 0) {
                $this->recordMovement($productId, $initialStock, 'entrada', 'Stock inicial', $userId);
            }

            $this->db->commit();
        } catch (Throwable $exception) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $exception;
        }
    }

    public function adjustStock(int $productId, int $quantity, string $type, string $reason, int $userId): void
    {
        $this->db->beginTransaction();

        try {
            $statement = $this->db->prepare('SELECT stock FROM productos WHERE id = :id FOR UPDATE');
            $statement->execute(['id' => $productId]);
            $currentStock = $statement->fetchColumn();

            if ($currentStock === false) {
                throw new DomainException('El producto seleccionado ya no existe.');
            }

            $delta = $type === 'salida' ? -$quantity : $quantity;
            $newStock = $type === 'ajuste' ? $quantity : (int) $currentStock + $delta;

            if ($type === 'ajuste') {
                $delta = $newStock - (int) $currentStock;
            }

            if ($newStock < 0) {
                throw new DomainException('La salida no puede ser mayor que el stock disponible.');
            }

            $update = $this->db->prepare('UPDATE productos SET stock = :stock WHERE id = :id');
            $update->execute(['stock' => $newStock, 'id' => $productId]);
            $this->recordMovement($productId, $delta, $type, $reason, $userId);
            $this->db->commit();
        } catch (Throwable $exception) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            throw $exception;
        }
    }

    private function recordMovement(int $productId, int $quantity, string $type, string $reason, int $userId): void
    {
        $statement = $this->db->prepare(
            'INSERT INTO movimientos_inventario (producto_id, usuario_id, tipo, cantidad, motivo)
             VALUES (:producto_id, :usuario_id, :tipo, :cantidad, :motivo)'
        );
        $statement->execute([
            'producto_id' => $productId,
            'usuario_id' => $userId,
            'tipo' => $type,
            'cantidad' => $quantity,
            'motivo' => $reason,
        ]);
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
            $statement = $this->db->prepare('SELECT 1 FROM productos WHERE codigo_barras = :barcode LIMIT 1');
            $statement->execute(['barcode' => $barcode]);
            if ($statement->fetchColumn() === false) {
                return $barcode;
            }
        }

        throw new DomainException('No se pudo generar un código de barras único para el producto.');
    }
}
