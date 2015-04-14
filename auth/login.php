<?php
require_once('../api/dbConnect.php');

session_start();

if (isset($_SESSION['username'])) {
    returnError("Already logged in, what are you doing?");
} else {
    $data = json_decode(file_get_contents("php://input"));
    if (!isset($data)) returnError("POST data not received.");
    else if (!isset($data->username)) returnError("Username was not set.");
    else if (!isset($data->password)) returnError("Password was not set.");

    $connection = connectToDatabase();

    $saltSQL = "SELECT password, salt, account FROM users WHERE username = :username";
    $query = $connection->prepare($saltSQL);
    $query->bindParam(':username', $data->username);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_OBJ);

    if ($query->rowCount() === 1) {
        $salt = $results[0]->salt;
        $password = $results[0]->password;
        $account = $results[0]->account;

        $inputPasswordHash = $data->password.$salt;
        for ($i = 0; $i < 50; $i++) $inputPasswordHash = hash('sha256', $inputPasswordHash);

        if ($inputPasswordHash == $password) {
            $_SESSION['username'] = $data->username;
            $_SESSION['account'] = $account;

            $unpreparedIPSQL = "UPDATE users SET lastip=:lastip WHERE username = :username";
            $query = $connection->prepare($unpreparedIPSQL);
            $query->bindParam(':lastip', $_SERVER['REMOTE_ADDR']);
            $query->bindParam(':username', $data->username);
            $query->execute();

            die(json_encode(['success' => 'Logged in successfully.']));
        } else {
            returnError("Wrong username or password.");
        }
    } else {
        returnError("Wrong username or password.");
    }
}
