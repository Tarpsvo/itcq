<!DOCTYPE html>
<html data-ng-app="itcqAdmin" data-ng-controller="itcqAdminCtrl">
    <head>
        <meta charset="UTF-8">
        <title>ITCQ - Admin</title>

        <link rel="stylesheet" href="../css/cssreset.css"> <!-- Eric Meyer's Reset CSS v2.0 - http://cssreset.com -->
        <link rel="stylesheet" href="../css/main.css">
        <link rel="stylesheet" href="../css/admin.css">
    </head>

    <body>
        <div id="content-wrapper">
            <ul id="menubar-big">
                <li><a href="#/questions" class="text-shadow admin-active">Questions</a></li>
                <li><a href="#/statistics" class="text-shadow">Statistics</a></li>

                <li><a href="/" id="back" class="text-shadow">Back to ITCQ</a></li>
            </ul>

            <div id="main-content" class="box-shadow" data-ng-view data-ng-cloak></div>
        </div>

        <script src="../js/jquery-2.1.3.min.js"></script>
        <script src="../js/angular.js"></script>
        <script src="../js/angular-route.js"></script>
        <script src="../js/itcqAdmin.js"></script>
    </body>
</html>
