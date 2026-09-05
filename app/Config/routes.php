<?php
declare(strict_types=1);

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\DoctorController;
use App\Controllers\PatientController;

return [
    'GET' => [
        '/' => [AuthController::class, 'login'],
        '/login' => [AuthController::class, 'login'],
        '/logout' => [AuthController::class, 'logout'],
        '/admin' => [AdminController::class, 'dashboard'],
        '/doctor' => [DoctorController::class, 'dashboard'],
        '/doctor/patients' => [DoctorController::class, 'patients'],
        '/doctor/appointments' => [DoctorController::class, 'appointments'],
        '/doctor/records' => [DoctorController::class, 'records'],
        '/doctor/prescriptions' => [DoctorController::class, 'prescriptions'],
        '/doctor/messages' => [DoctorController::class, 'messages'],
        '/patient' => [PatientController::class, 'dashboard'],
        '/patient/appointments' => [PatientController::class, 'appointments'],
        '/patient/medications' => [PatientController::class, 'medications'],
        '/patient/prescriptions' => [PatientController::class, 'prescriptions'],
        '/patient/messages' => [PatientController::class, 'messages'],
    ],
    'POST' => [
        '/login' => [AuthController::class, 'authenticate'],
    ],
];
