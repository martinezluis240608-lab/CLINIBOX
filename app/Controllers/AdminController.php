<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;

final class AdminController extends Controller
{
    public function dashboard(): void
    {
        Auth::requireRole('admin');
        $this->view('admin/dashboard', ['title' => 'Administración']);
    }
}
