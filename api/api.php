<?php
// Allowed queries:
// ql = question list for admin view
// cat = category list for new question view

if (isset($_GET['request'])) $queryType = $_GET['request']; else {
    $postedData = file_get_contents("php://input");
    $data = json_decode($postedData);
    $queryType = $data->request;
}

$allowedQueries = ['ql', 'cat', 'add'];
$allowedQueriesList = [
    'ql'    => "SELECT id, category, question, answer, enabled FROM questions",
    'cat'   => "SELECT name FROM categories",
];

// If request is not an allowed one, exit program.
if (!in_array($queryType, $allowedQueries)) die("Query not allowed!");

// Create the database connection
$connection = connectToDatabase();

switch ($queryType) {
    case ($queryType == 'ql' || $queryType == 'cat'):
        queryAndMakeJson($connection, $allowedQueriesList[$queryType]);
    break;

    case 'add':
        $validatedData = validateData($data);
        addNewQuestion($connection, $validatedData);
    break;

    default:
        # code...
        break;
}

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

function queryAndMakeJson($connection, $sql) {
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

function createErrorJson($error) {
    $json = json_encode(array('ERROR' => $error));
    echo $json;
}

function validateData($data) {
    $q['question'] = $data->question;
    $q['category'] = $data->category;
    $q['answer'] = $data->answer;
    $q['wrong'] = $data->wrong;
    if ($data->enabled == 'true') $q['enabled'] = 1; else $q['enabled'] = 0;

    if (!$q['question'] || !$q['category'] || !$q['answer'] || !$q['wrong'] || !$q['enabled']) die("One was empty");

    return $q;
}

function addNewQuestion($connection, $q) {
    $sql = "INSERT INTO questions (category, question, answer, wrongs, enabled) VALUES ('".$q['category']."', '".$q['question']."', '".$q['answer']."', '".$q['wrong']."', '".$q['enabled']."')";

    $connection->exec($sql);
    }

?>
