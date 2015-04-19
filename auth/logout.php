<?php
session_start();
unset($_SESSION['username']);
unset($_SESSION['account']);
session_destroy();
die(json_encode(array('success' => 'Successfully logged out.')));
?>
