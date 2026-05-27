<?php
include "koneksi.php";
session_start();
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

    <title>login page</title>

</head>  
<body>
    <?php

if (isset($_POST['submit'])) {
    $email = $_POST['email'];
    $password = md5($_POST['password']);

  
    $query = mysqli_query($koneksi, "SELECT * FROM user WHERE email='$email' AND password='$password'");
    
    if (mysqli_num_rows($query) > 0){
        $data = mysqli_fetch_array($query);
        $_SESSION['nama_user'] = $data['username'];
        echo "<script>alert('Login Berhasil: Selamat Datang " . $data['username'] . "');
            location.href='dashboard.php';</script>";
    } else {
        echo "<script>alert('Login Gagal: Pastikan email dan password benar!');
            location.href='login.php';</script>";    
    }    
}
?>
  
    <div class="global-container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card login-form card p-4 p-md-5 shadow-sm-3 rounded-4 border-0 card animate__animated animate__fadeInDown duration-1s" style="background-color: #F8FAFC;">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">L O G I N</h3>
            </div>
            <div class="card-text-center">
                <form method="POST">
                    <div class="mb-4">
                        <label for="InputEmail1" class="form-label fw-bold">Email address</label>
                        <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" name="email" required>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-4">
                        <label for="Password1" class="form-label fw-bold">Password</label>
                        <input type="password" class="form-control" id="Password1"  aria-describedby="passwordHelp" name="password" required>
                    </div>
                    
                     <button type="submit" name="submit" class="btn btn-center btn-lg w-100 mt-3 rounded-pill" style="background-color: #8B5CF6; color: white;" >Login</button>
                </form>
            </div>
        </div>
    </div>

<footer>
    <div class="container text-center bottom py-3">
        <p class="text-secondary mb-0">&copy; 2026 taskU. All rights reserved.</p>
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
</script>
</body>
</html>