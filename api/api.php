<?php
require_once('db_connect.php');

$allowedGet = ['ql', 'cat', 'stats', 'qst', 'qstData', 'al'];
$allowedPost = ['add', 'newcat', 'editQst', 'delQst', 'newacc'];
$id = $api = $request = '';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (!isset($_GET['request'])) returnError("Request type not defined."); else $request = $_GET['request'];
        if (!in_array($_GET['request'], $allowedGet)) returnError("Unrecognized request type.");
        require_once('getAPI.php');
        $api = new getAPI();
        $id = (isset($_GET['id'])) ? $_GET['id'] : '';
    break;

    case 'POST':
        if (!isset($_GET['request'])) returnError("Request type not defined."); else $request = $_GET['request'];
        if (!in_array($_GET['request'], $allowedPost)) returnError("Unrecognized request type.");
        session_start();
        if (!isset($_SESSION['username'])) returnError("Not authorized for this query.");
        require_once('postAPI.php');
        $api = new postAPI();
    break;

    default:
        returnError("Invalid request method.");
    break;
}

$connection = connectToDatabase();
$api->execute($connection, $request, $id);
