<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cleany Box - Mi Perfil</title>
    <link rel="stylesheet" href="/CLINIBOX/public/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .profile-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }

        .profile-avatar-wrapper {
            position: relative;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: var(--shadow-md);
        }

        .edit-avatar-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: var(--primary-color);
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px solid white;
            transition: all 0.2s;
        }

        .edit-avatar-btn:hover {
            background-color: var(--primary-hover);
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .form-section-title {
            font-size: 1.1rem;
            margin: 2rem 0 1rem 0;
            color: var(--primary-color);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
        }
    </style>
</head>
<body>

<div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-logo">
            <i class="fa-solid fa-heart-pulse"></i> Cleany Box
        </div>
        
        <nav class="sidebar-nav">
            <a href="javascript:history.back()" class="nav-item"><i class="fa-solid fa-arrow-left"></i> Volver</a>
            <br>
            <a href="#" class="nav-item active"><i class="fa-regular fa-user"></i> Datos Personales</a>
            <a href="#" class="nav-item"><i class="fa-solid fa-lock"></i> Seguridad y Contraseña</a>
            <a href="#" class="nav-item"><i class="fa-regular fa-bell"></i> Notificaciones</a>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <div class="profile-container">
            <div class="card">
                <div class="profile-header">
                    <div class="profile-avatar-wrapper">
                        <img src="https://i.pravatar.cc/150?img=5" alt="Perfil" class="profile-avatar">
                        <div class="edit-avatar-btn">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <div>
                        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Mi Perfil</h2>
                        <p style="color: var(--text-muted);">Actualiza tu información personal y datos de contacto.</p>
                        <span class="badge badge-success" style="margin-top: 0.5rem;">Cuenta Verificada</span>
                    </div>
                </div>

                <form action="#" method="POST">
                    <h3 class="form-section-title">Información Básica</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Nombres</label>
                            <input type="text" class="form-control" value="María Fernanda">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Apellidos</label>
                            <input type="text" class="form-control" value="López">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Fecha de Nacimiento</label>
                            <input type="date" class="form-control" value="1995-08-15">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Género</label>
                            <select class="form-control">
                                <option>Femenino</option>
                                <option>Masculino</option>
                                <option>Otro</option>
                            </select>
                        </div>
                    </div>

                    <h3 class="form-section-title">Datos de Contacto</h3>
                    <div class="form-grid">
                        <div class="form-group full-width">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" class="form-control" value="mfernanda.lopez@ejemplo.com" readonly style="background-color: var(--bg-color);">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Teléfono Móvil</label>
                            <input type="tel" class="form-control" value="+52 555-0192">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Teléfono Fijo (Opcional)</label>
                            <input type="tel" class="form-control">
                        </div>
                        <div class="form-group full-width">
                            <label class="form-label">Dirección Residencial</label>
                            <input type="text" class="form-control" value="Av. Siempre Viva 123, Col. Centro">
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                        <button type="button" class="btn btn-outline" onclick="history.back()">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="alert('Datos actualizados correctamente')">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

</body>
</html>
