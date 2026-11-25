<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?= e($title) ?> | CliniBox Paciente</title>
  <link rel="stylesheet" href="/CLINIBOX/public/assets/css/patient-dashboard.css?v=patient-layout-4">
<link rel="stylesheet" href="/CLINIBOX/public/assets/css/profile-menu.css?v=3">
<script src="/CLINIBOX/public/assets/js/profile-menu.js?v=2" defer></script>
    <link rel="stylesheet" href="/CLINIBOX/public/assets/css/clinibox.css?v=5">
    <script src="/CLINIBOX/public/assets/js/page-size.js?v=1" defer></script>
</head>
<body class="patient-dashboard-page">
<div class="app-shell patient-shell">
  <aside class="patient-sidebar">
    <clinibox-profile-menu data-label="Portal del paciente" data-profile="paciente/perfil"></clinibox-profile-menu>
    <nav aria-label="Navegación del paciente">
      <div class="nav-list">
        <a href="/CLINIBOX/public/paciente/inicio">Resumen del paciente</a>
        <a href="/CLINIBOX/public/citas">Agendar cita</a>
        <a href="/CLINIBOX/public/paciente/consultas" class="active" aria-current="page">Citas agendadas</a>
        <a href="/CLINIBOX/public/paciente/medicamentos">Farmacia</a>
        <a href="/CLINIBOX/public/paciente/recetas">Recetas</a>
        <a href="/CLINIBOX/public/paciente/mensajes">Mensajes</a>
      </div>
    </nav>
  </aside>

  <main class="patient-main">
    <header class="patient-topbar">
      <h1 class="topbar-section-title">Citas agendadas</h1>
    </header>

    <div class="glass-panel" style="padding: 24px;">
      <div class="card-title-bar">
        <h3>Mis citas</h3>
        <a class="btn btn-outline btn-sm" href="/CLINIBOX/public/citas">Agendar cita</a>
      </div>

      <div class="appointment-items-list" data-booked-appointments></div>
    </div>

    <div class="glass-panel" style="padding: 24px;">
      <div class="card-title-bar"><h3>Historial de ejemplo</h3></div>
      <div class="appointment-items-list">
        <?php foreach ($appointments as $appointment): ?>
          <?php $completed = $appointment['status'] === 'Finalizada'; ?>
          <div class="appointment-entry">
            <div class="ae-date-col<?= $completed ? ' completed' : '' ?>">
              <small><?= e(date('d/m/Y', strtotime($appointment['date']))) ?></small>
              <strong><?= e($appointment['time']) ?></strong>
            </div>
            <div class="ae-info-col">
              <strong><?= e($appointment['doctor']) ?></strong>
              <p><?= e($appointment['reason']) ?></p>
            </div>
            <span class="status-tag <?= $completed ? 'completed' : 'confirmed' ?>"><?= e($appointment['status']) ?></span>
          </div>
        <?php endforeach; ?>
        <?php if (!$appointments): ?>
          <p>No hay consultas en el historial.</p>
        <?php endif; ?>
      </div>
    </div>
  </main>
</div>
<script>
</script>
<script src="/CLINIBOX/public/assets/js/appointment-booking.js?v=separate-1"></script>
</body>
</html>
