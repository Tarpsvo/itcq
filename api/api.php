<?php
require_once('db_connect.php');

$allowedGet = ['questionList', 'categoryList', 'stats', 'question', 'questionData', 'accountList', 'accountData'];
$allowedPost = ['addNewQuestion', 'newCategory', 'editQuestion', 'deleteQuestion', 'newAccount', 'logQuestionAnswer', 'deleteAccount', 'editAccount', 'addQuestionSuggestion'];
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
        require_once('postAPI.php');
        $api = new postAPI();
    break;

    default:
        returnError("Invalid request method.");
    break;
}

$connection = connectToDatabase();
$api->execute($connection, $request, $id);
