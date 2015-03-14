<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('Location: /');
} else {
?>

<!DOCTYPE html>
<html data-ng-app="itcqAdmin" data-ng-controller="AdminController">
    <head>
        <meta charset="UTF-8">
        <title>ITCQ - Admin</title>

        <link rel="stylesheet" href="../css/cssreset.css"> <!-- Eric Meyer's Reset CSS v2.0 - http://cssreset.com -->
        <link rel="stylesheet" href="../css/main.css">
        <link rel="stylesheet" href="../css/admin.css">
    </head>

    <body>
        <div id="admin-content-wrapper">
            <ul id="menubar-big">
                <li><a href="#/questions" class="admin-menu-button text-shadow" data-ng-class="{'admin-active': menuIsActive('/questions')}">Questions</a></li>
                <li><a href="#/statistics" class="admin-menu-button text-shadow" data-ng-class="{'admin-active': menuIsActive('/statistics')}">Statistics</a></li>

                <li><a href="/" id="back" class="admin-menu-button text-shadow">Back to ITCQ</a></li>
            </ul>

            <div id="main-content" data-ng-view data-ng-cloak></div>
        </div>

        <script src="../js/jquery-2.1.3.min.js"></script>
        <script src="../js/angular.js"></script>
        <script src="../js/angular-route.js"></script>

        <!--  itcqAdmin and its controllers  -->
        <script src="../js/itcqAdmin.js"></script>
        <script src="../js/itcqAdmin/adminController.js"></script>
        <script src="../js/itcqAdmin/errorService.js"></script>
        <script src="../js/itcqAdmin/questionFormController.js"></script>
    </body>
</html>
<?php } ?>
