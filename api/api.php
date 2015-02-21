<?php
// Allowed queries:
// ql   = question list (get)
// cat  = categories list (get)
// add  = add a new question (post)
$allowedGet = ['ql', 'cat', 'stats'];
$allowedPost = ['add'];

if (isset($_GET['request']) && in_array($_GET['request'], $allowedGet)) {
    require_once('getAPI.php');
    $api = new getAPI();
    $request = $_GET['request'];
} elseif (isset($_GET['request']) && in_array($_GET['request'], $allowedPost)) {
    require_once('postAPI.php');
    $api = new postAPI();
    $request = $_GET['request'];
} else {
    returnError("Request invalid.");
}

// Database information
$host = 'localhost';
$database = 'itcq';
$username = 'root';
$password = 'root';

// Create the connection
$connection = connectToDatabase($host,$database,$username,$password);

// Send the data to the appropriate API
$api->execute($connection, $request);

function connectToDatabase($host,$database,$username,$password) {
    // Learned from http://www.w3schools.com/php/php_mysql_connect.asp
    try {
        $connection = new PDO("mysql: host=$host; dbname=$database; charset=utf8", $username, $password);

        // Set the PDO error mode to exception: http://php.net/manual/en/pdo.error-handling.php
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $connection;
    } catch (PDOException $e) {
        returnError($e->getMessage());
    }
}

function returnError($error) {
    // Create a JSON with the key 'ERROR' and echo it
    http_response_code(400);
    die(json_encode(array('error' => $error)));
}
?>
