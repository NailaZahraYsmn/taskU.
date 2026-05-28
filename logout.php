<?php
session_start(); //[cite: 6]
session_unset();    // Kosongkan semua data session[cite: 6]
session_destroy();  // Hancurkan session di server[cite: 6]

// Kirim respons balik ke JavaScript bahwa proses sukses
echo json_encode(["status" => "success"]); //[cite: 6]
exit; //[cite: 6]
?>