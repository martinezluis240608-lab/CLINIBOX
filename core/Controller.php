<?php
// Base Controller
// Carga los modelos y las vistas

class Controller {
    // Cargar modelo
    public function model($model) {
        // Requerir archivo del modelo
        require_once '../app/models/' . $model . '.php';
        // Instanciar el modelo
        return new $model();
    }

    // Cargar vista
    public function view($view, $data = []) {
        // Chequear si el archivo de la vista existe
        if(file_exists('../app/views/' . $view . '.php')) {
            require_once '../app/views/' . $view . '.php';
        } else {
            // La vista no existe
            die('La vista no existe: ' . $view);
        }
    }
}
