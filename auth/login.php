<?php
require_once('../api/db_connect.php');

session_start();

if (isset($_SESSION['username'])) {
    returnError("Already logged in, what are you doing?");
} else {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data)) returnError("POST data not received.");
    else if (!isset($data->username)) returnError("Username was not set.");
    else if (!isset($data->password)) returnError("Password was not set.");

    $connection = connectToDatabase();
    $username = $data->username;
    $password = $data->password;

    $unpreparedSQL = "SELECT 1 FROM users WHERE username = :username AND password = :password";
    $query = $connection->prepare($unpreparedSQL);
    $query->bindParam(':username', $username);
    $query->bindParam(':password', $password);

    $query->execute();

    if ($query->rowCount() === 1) {
        $_SESSION['username'] = $username;
        die(json_encode(['success' => 'Gratz on login']));
    } else {
        returnError("Wrong username or password.");
    }
}
?>
