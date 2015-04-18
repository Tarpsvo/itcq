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

function returnSuccess($message) {
    http_response_code(200);
    die(json_encode(array('success' => $message)));
}

function restrictFunctionToAccount($account) {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (isset($_SESSION['account'])) {
        if ($account != $_SESSION['account']) {
            if (!($_SESSION['account'] == 'admin' && $account == 'user')) returnError("Not authorized to query this.");
        }
    } else {
        returnError("Not authorized to query this.");
    }
}
