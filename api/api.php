<?php
// Allowed queries:
// ql   = question list (get)
// cat  = categories list (get)
// add  = add a new question (post)
$allowedGet = ['ql', 'cat', 'stats', 'qst'];
$allowedPost = ['add'];

if (isset($_GET['request']) && in_array($_GET['request'], $allowedGet)) {
    require_once('getAPI.php');
    require_once('db_connect.php');
    $api = new getAPI();
    $request = $_GET['request'];
} elseif (isset($_GET['request']) && in_array($_GET['request'], $allowedPost)) {
    require_once('postAPI.php');
    require_once('db_connect.php');
    $api = new postAPI();
    $request = $_GET['request'];
} else {
    returnError("Request invalid.");
}

// Create the connection
$connection = connectToDatabase($host,$database,$username,$password);

// Send the data to the appropriate API
$api->execute($connection, $request);

function returnError($error) {
    // Create a JSON with the key 'ERROR' and echo it
    http_response_code(400);
    die(json_encode(array('error' => $error)));
}
?>
