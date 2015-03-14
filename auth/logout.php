<?php
session_start();
unset($_SESSION['username']);
session_destroy();
die(json_encode(['success' => 'Successfully logged out']));
?>
