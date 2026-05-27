<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

    <title>Daftar page </title>

</head>  
<body>
        <?php
        if(isset($_POST['username'])){
            include "koneksi.php"; 

            $email = $_POST['email'];
            $username = $_POST['username'];
            $password = $_POST['password'];
            $confirm_password = $_POST['confirm_password']; 
            

            // Logika Pengecekan: Apakah kedua password cocok?
            if ($password !== $confirm_password) {
                echo "<script>alert('Daftar Gagal: Password dan Konfirmasi Password tidak cocok!');
                    window.history.back();</script>";
            } else {
                // Jika cocok, lakukan enkripsi md5 dan query INSERT
                $password_md5 = md5($password);
                
                $query = mysqli_query($koneksi, "INSERT INTO user VALUES (null,'$username', '$password_md5', '$email')");
                if ($query){
                    echo "<script>alert('Daftar Berhasil: Silahkan login!');
                        location.href='login.php';</script>";
                } else {
                    echo "<script>alert('Daftar Gagal: Pastikan data benar!');
                        location.href='daftar.php';</script>";    
                }    
            }
        }
    ?>
    <!-- container form -->
    <div class="global-container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card register-form card p-4 p-md-5 shadow-sm-3 rounded-4 border-0 card animate__animated animate__fadeInDown duration-1s" style="background-color: #F8FAFC;">
            <div class="card-body">
                <h3 class="card-title text-center mb-3">D A F T A R</h3>
            </div>
            <div class="card-text-center">
                <form action="login.html" method="POST">
                    <div class="mb-4">
                        <label for="InputEmail1" class="form-label fw-bold">Email address</label>
                        <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" name="email" required>
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-4">
                        <label for="Username1" class="form-label fw-bold">Username</label>
                        <input type="text" class="form-control" id="Username1" aria-describedby="usernameHelp" name="username" required>
                        <div id="usernameHelp" class="form-text">Your username must be unique and contain 3-15 characters.</div>
                    </div>
                    <div class="mb-4">
                        <label for="Password1" class="form-label fw-bold">Password</label>
                        <input type="password" class="form-control" id="Password1"  aria-describedby="passwordHelp" name="password" required>
                        <div id="passwordHelp" class="form-text">Your password must be 8-20 characters long.</div>
                    </div>
                    <div class="mb-4">
                        <label for="ConfirmPassword1" class="form-label fw-bold">Confirm Password</label>
                        <input type="password" class="form-control" id="ConfirmPassword1" aria-describedby="confirmPasswordHelp" name="confirm_password" required>
                        <div id="confirmPasswordHelp" class="form-text">Please confirm your password.</div>
                    </div>
                    
                    <button type="submit" class="btn btn-center btn-lg w-100 mt-3 rounded-pill" style="background-color: #8B5CF6; color: white;">Save</button>
                </form>
            </div>
        </div>
    </div>

<footer>
    <div class="container text-center bottom py-3 ">
        <p class="text-secondary mb-0">&copy; 2026 taskU. All rights reserved.</p>
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous">
</script>
</body>
</html>