<?php
session_start();
session_unset();    // Kosongkan  data session
session_destroy();  // Hancurkan session di server

// Kirim respons balik ke JavaScript bahwa proses sukses
echo json_encode(["status" => "success"]);
exit;
?>