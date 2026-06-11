<?php
header('Content-Type: application/json');
session_start();
include "koneksi.php";

if (!isset($_SESSION['nama_user'])) {
    echo json_encode(["status" => "error", "message" => "Akses ditolak"]);
    exit;
}

$username = $_SESSION['nama_user'];
$action = $_GET['action'] ?? '';

// ==========================================
// 0. AMBIL user_id BERDASARKAN username
// ==========================================
// Karena tabel tasks membutuhkan user_id, kita cari dulu ID-nya
$query_user = mysqli_query($koneksi, "SELECT id FROM user WHERE username='$username'");
if (mysqli_num_rows($query_user) > 0) {
    $row_user = mysqli_fetch_assoc($query_user);
    $user_id = $row_user['id'];
} else {
    // Jika tidak ketemu (jarang terjadi jika session valid)
    echo json_encode(["status" => "error", "message" => "User tidak ditemukan di database"]);
    exit;
}

// 1. AMBIL DATA TUGAS (READ)
if ($action == 'list') {
    // Kita bisa query berdasarkan user_id (lebih aman) atau username
    $query = mysqli_query($koneksi, "SELECT id, task_text AS text, task_option AS tag, task_date AS date, completed FROM tasks WHERE user_id='$user_id'");
    $data = [];
    while ($row = mysqli_fetch_assoc($query)) {
        // Konversi completed ke boolean (0/1 dari DB ke true/false)
        $row['completed'] = (bool)$row['completed'];
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}

// Ambil input JSON dari Fetch API
$input = json_decode(file_get_contents('php://input'), true);

// 2. TAMBAH / EDIT DATA TUGAS (CREATE / UPDATE)
if ($action == 'save') {
    $text = mysqli_real_escape_string($koneksi, $input['text']);
    $tag = mysqli_real_escape_string($koneksi, $input['tag']);
    $date = mysqli_real_escape_string($koneksi, $input['date']);
    $id = $input['id'] ?? null;

    if ($id) {
        // Edit tugas yang sudah ada (Pastikan milik user ini berdasarkan user_id)
        $query = mysqli_query($koneksi, "UPDATE tasks SET task_text='$text', task_option='$tag' WHERE id='$id' AND user_id='$user_id'");
    } else {
        // Tambah tugas baru (Sekarang kita INSERT juga user_id nya!)
        $query = mysqli_query($koneksi, "INSERT INTO tasks (user_id, username, task_text, task_option, task_date, completed) VALUES ('$user_id', '$username', '$text', '$tag', '$date', 0)");
    }

    if ($query) echo json_encode(["status" => "success"]);
    else echo json_encode(["status" => "error", "message" => mysqli_error($koneksi)]);
    exit;
}

// 3. TOGGLE STATUS SELESAI (UPDATE STATUS)
if ($action == 'toggle') {
    $id = mysqli_real_escape_string($koneksi, $input['id']);
    $completed = $input['completed'] ? 1 : 0;

    $query = mysqli_query($koneksi, "UPDATE tasks SET completed='$completed' WHERE id='$id' AND user_id='$user_id'");
    if ($query) echo json_encode(["status" => "success"]);
    exit;
}

// 4. HAPUS TUGAS (DELETE)
if ($action == 'delete') {
    $id = mysqli_real_escape_string($koneksi, $input['id']);

    $query = mysqli_query($koneksi, "DELETE FROM tasks WHERE id='$id' AND user_id='$user_id'");
    if ($query) echo json_encode(["status" => "success"]);
    exit;
}