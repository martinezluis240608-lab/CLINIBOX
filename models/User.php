<?php
class User {
    private $db;

    public function __construct() {
        $this->db = new Database;
    }

    // Encontrar usuario por email
    public function findUserByEmail($email) {
        $this->db->query('SELECT * FROM users WHERE email = :email');
        $this->db->bind(':email', $email);

        $row = $this->db->single();

        // Chequear si hay resultados
        if($this->db->rowCount() > 0) {
            return $row;
        } else {
            return false;
        }
    }

    // Autenticar usuario
    public function login($email, $password, $role) {
        $row = $this->findUserByEmail($email);

        if($row == false) return false;

        // Verificar que el rol coincida
        if($row->role !== $role) return false;

        $hashed_password = $row->password;
        if(password_verify($password, $hashed_password)) {
            return $row;
        } else {
            return false;
        }
    }

    // Obtener detalles del paciente
    public function getPatientDetails($user_id) {
        $this->db->query('SELECT * FROM patients WHERE user_id = :id');
        $this->db->bind(':id', $user_id);
        return $this->db->single();
    }

    // Obtener detalles del médico
    public function getDoctorDetails($user_id) {
        $this->db->query('SELECT * FROM doctors WHERE user_id = :id');
        $this->db->bind(':id', $user_id);
        return $this->db->single();
    }
}
