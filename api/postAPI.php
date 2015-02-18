<?php
// Add the database file
require_once('db.php');

$postedData = file_get_contents("php://input");
$data = json_decode($postedData);
if (isset($data->request)) $request = $data->request; else returnError("Request not defined.");

$connection = connectToDatabase();

switch ($request) {
    case 'add':
        addNewQuestion($connection, validateData($data));
    break;
}

function validateData($data) {
    if ($data->enabled == 'true') $data->enabled = '1'; else $data->enabled = '0';

    if (!$data->question || !$data->category || !$data->answer || !$data->wrong) returnError("One mandatory field was empty.");

    return $data;
}

function addNewQuestion($connection, $data) {
    $sql = "INSERT INTO questions (category, question, answer, wrongs, enabled) VALUES ('".$data->category."', '".$data->question."', '".$data->answer."', '".$data->wrong."', '".$data->enabled."')";

    $connection->exec($sql);
}
