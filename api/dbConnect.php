<?php
function connectToDatabase() {
    $host = 'localhost';
    $database = 'itcq';
    $username = 'root';
    $password = 'root';

    try {
        $connection = new PDO("mysql: host=$host; dbname=$database; charset=utf8", $username, $password);

        /* Set the PDO error mode to exception: http://php.net/manual/en/pdo.error-handling.php */
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $connection;
        
    } catch (PDOException $e) {
        returnError($e->getMessage());
    }
}

function returnError($error) {
    http_response_code(400);
    die(json_encode(array('error' => $error)));
}
