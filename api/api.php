<?php
// Allowed queries:
// ql = question list (from database)

$allowedQueries = ['ql'];
$queryType = $_GET['request'];

// If request is not an allowed one, exit program.
if (!in_array($queryType, $allowedQueries)) die("Query not allowed!");

// Create the database connection
$connection = connectToDatabase();

switch ($queryType) {
    case 'ql':
        getQuestionList($connection);
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
        die("ERROR: Connection failed: " . $e->getMessage());
    }
}

function getQuestionList($connection) {
        $sql = 'SELECT * FROM questions';
        $queryResult = $connection->query($sql);

        // Learned from http://www.w3schools.com/php/php_mysql_select.asp
        if ($queryResult) {
            // JSON part learned from http://www.phpro.org/tutorials/Consume-Json-Results-From-PHP-MySQL-API-With-Angularjs-And-PDO.html
            $queryResult = $queryResult->fetchAll( PDO::FETCH_ASSOC );
            $json = json_encode($queryResult);
            echo $json;
        }
}


?>
