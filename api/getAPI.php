<?php
// Add the database file
require_once('db.php');

// Allowed queries:
// ql = question list for admin view
// cat = category list for new question view

// If request, set requestType, else return error
if (isset($_GET['request'])) $request = $_GET['request']; else returnError("Request not defined.");

$allowedRequests = ['ql', 'cat'];
$sqlList = [
    'ql'    => "SELECT id, category, question, answer, enabled FROM questions",
    'cat'   => "SELECT name FROM categories"
];

// If not in allowed requests array, return error
if (!in_array($request  , $allowedRequests)) returnError("Stated request not found.");

// Create connection to database
$connection = connectToDatabase();

// Run SQL command, turn the return value to json and echo it
queryAndReturnJson($connection, $sqlList[$request]);




// Function that executes query and echos the json
function queryAndReturnJson($connection, $sql) {
    $queryResult = $connection->query($sql);

    // Learned from http://www.w3schools.com/php/php_mysql_select.asp
    if ($queryResult) {
        // JSON part learned from http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
        $queryResult = $queryResult->fetchAll( PDO::FETCH_ASSOC );
        $json = json_encode($queryResult);
        echo $json;
    } else {
        createErrorJson("Query didn't return any results.");
    }
}
?>
