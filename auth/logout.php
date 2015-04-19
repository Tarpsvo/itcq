<?php
session_start();
unset($_SESSION['username']);
unset($_SESSION['account']);
session_destroy();
returnSuccess("Successfully logged out.");
?>
