<?php
session_start();
if (!isset($_SESSION['nama_user'])) {
  echo "<script>alert('Akses Ditolak: Silahkan login terlebih dahulu!');
  location.href='login.php';</script>";
  exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>taskU. Dashboard</title>
  <!-- link font montserrat -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- framework bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  <!-- library flatpickr -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
  
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- section navbar -->
  <nav class="navbar navbar-dark navbar-expand-lg fixed-top p-3 border-bottom border-secondary rounded-3">
    <div class="container-fluid px-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16" style=" color: var(--accent);">
        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
      </svg>
      <a class="navbar-brand bs-emphasis-color me-auto mx-lg-2" href="index.php" >taskU.</a>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">     
      </div>
      <!-- profile  -->
      <div class="position-relative ms-auto" id="profileWrapper">
        <button class="profile-btn" id="profileBtn">
          <div class="profile-avatar"><i class="bi bi-person"></i></div>
          <span id="username-display"><?= $_SESSION['nama_user'] ?></span>
          <i class="bi bi-chevron-down" style="font-size:.65rem;color:var(--text-muted);"></i>
        </button>
        <div class="profile-dropdown" id="profileDropdown" type="button" data-bs-toggle="dropdown">
          <div class="px-3 pb-2 pt-1" style="border-bottom:1px solid var(--border);margin-bottom:4px;">
            <div style="font-size:.8rem;font-weight:600;" class="text-primary"> <?= $_SESSION['nama_user'] ?> </div>
            <div style="font-size:.72rem;color:var(--text-muted);">Pengguna aktif</div>
          </div>
          <button class="dd-item danger" onclick="handleLogout()">
            <i class="bi bi-box-arrow-right"></i> Keluar
          </button>
        </div>
      </div>
    </div>
  </nav>
   
  <div class="app-body">
    <div class="row g-4">
      <div class="col-lg-5 col-xl-5">
        <div class="cal-card">
          <div id="main-calendar"></div>
        </div>
      </div>

      <div class="col-lg-7 col-xl-7">
        <div class="task-card">
          <div class="task-panel-title">Your Task Today</div>
          <div>
            <div class="task-date-label" id="selected-date-label">—</div>
            <form id="todo-form">
              <div class="row g-2">
                <div class="col-12">
                  <input type="text" id="todo-input" class="task-input" placeholder="Tambah tugas baru..." required>
                </div>
                <div class="col-8">
                  <select id="todo-tag" class="task-tag-select">
                    <option value="PENTING">PENTING</option>
                    <option value="OPSIONAL">OPSIONAL</option>
                    <option value="TAMBAHAN">TAMBAHAN</option>
                  </select>
                </div>
                <div class="col-4">
                  <button class="btn-add w-100" type="submit">Add</button>
                </div>
              </div>
            </form>
          </div>
          <div class="task-list-scroll" id="task-list-container"></div>
        </div>
      </div>
    </div>
  </div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

<script src="script.js"></script>

</body>
</html>