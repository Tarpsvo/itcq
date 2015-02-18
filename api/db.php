<?php
function connectToDatabase() {
    $host = 'localhost';
    $database = 'itcq';
    $username = 'root';
    $password = 'root';

    // Learned from http://www.w3schools.com/php/php_mysql_connect.asp
    try {
        $connection = new PDO("mysql:host=$host;dbname=$database", $username, $password);

        // Set the PDO error mode to exception
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $connection;
    } catch (PDOException $e) {
        die(createErrorJson($e->getMessage()));
    }
}

function returnError($error) {
    $json = json_encode(array('ERROR' => $error));
    die($json);
}
?>
