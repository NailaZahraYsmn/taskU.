<?php
header("Content-Type: application/json");
include "koneksi.php";
session_start();

// Pastikan user sudah login
if (!isset($_SESSION['nama_user'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// Ambil user_id berdasarkan username yang ada di session
$username = $_SESSION['nama_user'];
$user_query = mysqli_query($koneksi, "SELECT id FROM user WHERE username='$username'");

if (!$user_query) {
    echo json_encode(["status" => "error", "message" => "Query error: " . mysqli_error($koneksi)]);
    exit;
}

$user_data = mysqli_fetch_assoc($user_query);

if (!$user_data) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit;
}

$user_id = $user_data['id'];

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Mengambil semua data tugas milik user aktif
        $query = mysqli_query($koneksi, "SELECT id, task_text AS text, task_option AS tag, task_date AS date, completed FROM tasks WHERE user_id = $user_id");
        
        if (!$query) {
            echo json_encode(["status" => "error", "message" => "Query error: " . mysqli_error($koneksi)]);
            exit;
        }
        
        $tasks = [];
        while ($row = mysqli_fetch_assoc($query)) {
            $row['id'] = (int)$row['id'];
            $row['completed'] = (bool)$row['completed'];
            $tasks[] = $row;
        }
        echo json_encode($tasks);
        break;

    case 'POST':
        // Menambah atau memperbarui tugas
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['text']) || !isset($input['tag']) || !isset($input['date'])) {
            echo json_encode(["status" => "error", "message" => "Invalid input data"]);
            exit;
        }
        
        $text = mysqli_real_escape_string($koneksi, $input['text']);
        $tag = mysqli_real_escape_string($koneksi, $input['tag']);
        $date = mysqli_real_escape_string($koneksi, $input['date']);
        
        if (isset($input['id']) && !empty($input['id'])) {
            // Aksi Update / Edit Data
            $id = (int)$input['id'];
            $query = mysqli_query($koneksi, "UPDATE tasks SET task_text='$text', task_option='$tag', task_date='$date' WHERE id=$id AND user_id=$user_id");
        } else {
            // Aksi Insert Data Baru
            $query = mysqli_query($koneksi, "INSERT INTO tasks (user_id, task_text, task_option, task_date, completed) VALUES ($user_id, '$text', '$tag', '$date', 0)");
        }

        if ($query) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
        }
        break;

    case 'PUT':
        // Mengubah status completed (toggle)
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id']) || !isset($input['completed'])) {
            echo json_encode(["status" => "error", "message" => "Invalid input data"]);
            exit;
        }
        
        $id = (int)$input['id'];
        $completed = $input['completed'] ? 1 : 0;

        $query = mysqli_query($koneksi, "UPDATE tasks SET completed=$completed WHERE id=$id AND user_id=$user_id");
        if ($query) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
        }
        break;

    case 'DELETE':
        // Menghapus data tugas
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !isset($input['id'])) {
            echo json_encode(["status" => "error", "message" => "Invalid input data"]);
            exit;
        }
        
        $id = (int)$input['id'];

        $query = mysqli_query($koneksi, "DELETE FROM tasks WHERE id=$id AND user_id=$user_id");
        if ($query) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
        }
        break;
}
?>