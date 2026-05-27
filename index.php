<!DOCTYPE html>
<html lang="en">
<head>
    <title>taskU</title>
    <!-- Bootstrap-->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <!-- link font montserrat -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
    <link rel="stylesheet" href="style.css">
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    
    
</head>
<body data-bs-spy="scroll" data-bs-target="#navbar" data-bs-offset="50">
    <nav id="navbar" class="navbar navbar-dark navbar-expand-lg fixed-top p-3 border-bottom border-secondary rounded-3">
        <div class="container-fluid px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16" style=" color: var(--accent);">
                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
            </svg>
            <a class="navbar-brand bs-emphasis-color me-auto mx-lg-2" href="index.html" >taskU.</a>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav justify-content-center flex-grow-1 pe-3">
                        <li class="nav-item">
                            <a class="nav-link active" href="#index" data-section="index">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#about" data-section="about">About</a>
                        </li>
                    </ul>
                </div>
            </div>
            <a href="login.php" class="login-button">Masuk</a>
            <a href="daftar.php" class="register-button">Daftar</a>
        </div>
    </nav>

<!-- SECTION HOME -->
    <section id="index">
        <div class="container d-flex flex-column align-items-center justify-content-center text-center" style="height: 100vh;">
            <h1 class="display-4 mb-4 mt-5">Kelola Tugas, Hidup Jadi Makin Simpel</h1>
            <p class="lead mb-4">taskU. adalah solusi total buat manajemen tugasmu. Tetap teratur, makin produktif, dan capai semua goals-mu dengan mudah.</p>

            <a href="login.php" class="login-button h-10 w-20 d-inline-block"><b>Mulai Gratis</b></a>
            <div class="row g-5 mt-2">
            <!-- Item 1 -->
            <div class="col-md-4">
                <div class="p-4 rounded-4 bg-dark border border-secondary h-100 shadow-sm text-center">
                    <div class="mb-10 fs-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-lightning-charge-fill" viewBox="0 0 16 16" style=" color: var(--accent);">
                            <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                        </svg>
                    </div>
                    <h3 class="h4 fw-semibold text-white">Simple</h3>
                    <p class="text-secondary mb-3">Antarmuka minimalis yang dirancang untuk menjaga fokusmu tetap pada tugas utama.</p>
                </div>
            </div>
            <!-- Item 2 -->
            <div class="col-md-4">
                <div class="p-4 rounded-4 bg-dark border border-secondary h-100 shadow-sm text-center ">
                    <div class="mb-10 fs-1">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16" style=" color: var(--accent);">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    </div>
                    <h3 class="h4 fw-semibold text-white">Buat tugas dengan cepat</h3>
                    <p class="text-secondary mb-3">Tambahkan tugas baru hanya dalam satu klik, lengkap dengan kategori dan tenggat waktu.</p>
                </div>
            </div>
            <!-- Item 3 -->
            <div class="col-md-4">
                <div class="p-4 rounded-4 bg-dark border border-secondary h-100 shadow-sm text-center">
                    <div class="mb-10 fs-1">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bar-chart-line-fill" viewBox="0 0 16 16" style=" color: var(--accent);">
                            <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
                        </svg>
                    </div>
                    <h3 class="h4 fw-semibold text-white">Lacak progres</h3>
                    <p class="text-secondary mb-3">Lihat berapa tugas yang sudah selesai hari ini dan pantau produktivitasmu secara keseluruhan.</p>
                </div>
            </div>
        </div>
        </div>
    </section>
<!-- SECTION ABOUT -->
<section id="about" class="py-0 bg-surface"> 
    <div class="container d-flex flex-column align-items-center justify-content-center  text-center" style="height: 100vh;">
        <div class="text-center mb-3">
            <h2 class="display-4 mb-4 fw-bold text-accent">About taskU.</h2> 
            <p class="text-secondary mx-auto mb-0" style="max-width: 500px;">Produktivitas bukan tentang melakukan segalanya, tapi tentang fokus pada yang berarti.</p>
        </div>

        <div class="container text-center lead mt-0 mb-5">
            <div class="row  g-3 mt-0 gap-4">
                <div class="col bg-opacity-10 arounded-4 shadow p-3 bg-body-tertiary rounded h-100 shadow-lg">
                    <h3 class="h4 fw-semibold text-white mt-2">12K+</h3>
                    <p class="text-secondary mb-2">Pengguna aktif</p>
                </div>
                <div class="col bg-opacity-10 arounded-4 shadow p-3 bg-body-tertiary rounded h-100 shadow-lg">
                    <h3 class="h4 fw-semibold text-white mt-2">75%</h3>
                    <p class="text-secondary mb-2">Kepuasan pengguna</p>
                </div>
                <div class="col bg-opacity-10 arounded-4 shadow p-3 bg-body-tertiary rounded h-100 shadow-lg">
                    <h3 class="h4 fw-semibold text-white mt-2">2026</h3>
                    <p class="text-secondary mb-2">Tahun berdiri</p>
                </div>
            </div>
        </div>
    </div>
</section>
<footer>
    <div class="container text-center py-3">
        <p class="text-secondary mb-0">&copy; 2026 taskU. All rights reserved.</p>
    </div>
</footer>
</body>
</html>