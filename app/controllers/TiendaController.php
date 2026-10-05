<?php

namespace App\Controllers;

use App\Core\Controller;

class TiendaController extends Controller
{
    public function index(): void
    {
        $this->view('tienda/tienda');
    }

    public function categoria(): void
    {
        $this->view('tienda/categoria');
    }

    public function favoritos(): void
    {
        $this->view('tienda/favoritos');
    }

    public function producto(): void
    {
        $this->view('tienda/producto');
    }

    public function pedidos(): void
    {
        $this->view('tienda/pedidos');
    }

    public function ayuda(): void
    {
        $this->view('tienda/ayuda');
    }

    public function carrito(): void
    {
        $this->view('tienda/carrito');
    }
}