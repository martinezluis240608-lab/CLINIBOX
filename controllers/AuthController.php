<?php
class AuthController extends Controller {
    private $userModel;

    public function __construct() {
        $this->userModel = $this->model('User');
    }

    public function index() {
        $this->login();
    }

    public function login() {
        // Redirigir si ya está logueado
        if(isset($_SESSION['user_id'])) {
            $this->redirectBasedOnRole($_SESSION['user_role']);
        }

        $data = [
            'email' => '',
            'password' => '',
            'role' => 'patient',
            'email_err' => '',
            'password_err' => ''
        ];

        // Procesar formulario si es POST
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

            $data['email'] = trim($_POST['email']);
            $data['password'] = trim($_POST['password']);
            $data['role'] = trim($_POST['role']);

            // Validar email
            if(empty($data['email'])) {
                $data['email_err'] = 'Por favor ingrese su correo.';
            }

            // Validar password
            if(empty($data['password'])) {
                $data['password_err'] = 'Por favor ingrese su contraseña.';
            }

            // Verificar usuario y rol
            if(empty($data['email_err']) && empty($data['password_err'])) {
                // Comportamiento modificado según lo solicitado (Login de prueba)
                if($data['password'] === '12345678') {
                    $mockUser = new stdClass();
                    $mockUser->email = $data['email'];
                    $mockUser->role = $data['role'];
                    
                    if ($data['role'] === 'patient') {
                        $mockUser->id = 4; // ID de un paciente de prueba
                        $mockUser->name = 'Paciente (Prueba)';
                    } else if ($data['role'] === 'doctor') {
                        $mockUser->id = 2; // ID de un doctor de prueba
                        $mockUser->name = 'Doctor (Prueba)';
                    } else if ($data['role'] === 'admin') {
                        $mockUser->id = 1; // ID de un admin de prueba
                        $mockUser->name = 'Admin (Prueba)';
                    }

                    // Crear sesión
                    $this->createUserSession($mockUser);
                } else {
                    $data['password_err'] = 'Contraseña incorrecta. Por favor usa 12345678';
                    $this->view('auth/login', $data);
                }
            } else {
                // Cargar vista con errores
                $this->view('auth/login', $data);
            }
        } else {
            // Cargar vista por defecto
            $this->view('auth/login', $data);
        }
    }

    public function createUserSession($user) {
        $_SESSION['user_id'] = $user->id;
        $_SESSION['user_email'] = $user->email;
        $_SESSION['user_name'] = $user->name;
        $_SESSION['user_role'] = $user->role;
        $this->redirectBasedOnRole($user->role);
    }

    public function logout() {
        unset($_SESSION['user_id']);
        unset($_SESSION['user_email']);
        unset($_SESSION['user_name']);
        unset($_SESSION['user_role']);
        session_destroy();
        header('location: /CLINIBOX/public/login');
    }

    private function redirectBasedOnRole($role) {
        switch($role) {
            case 'patient':
                header('location: /CLINIBOX/public/patient');
                break;
            case 'doctor':
                header('location: /CLINIBOX/public/doctor');
                break;
            case 'admin':
                header('location: /CLINIBOX/public/admin');
                break;
        }
        exit;
    }
}
