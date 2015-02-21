<?php
class postAPI {
    public function execute($connection, $request) {
        // Get whole POST input: http://php.net/manual/en/wrappers.php.php#wrappers.php.input
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data)) returnError("POST data not received.");

        switch ($request) {
            case 'add':
                $this->addNewQuestion($connection, $data);
                $this->returnSuccess("Query executed.");
            break;
        }
    }

    public function addNewQuestion($connection, $data) {
        $category = (isset($data->category->name) ? mysql_real_escape_string($data->category->name) : returnError("Category not defined."));
        $question = (isset($data->question) ? mysql_real_escape_string($data->question) : returnError("Category not defined."));
        $answer = (isset($data->answer) ? mysql_real_escape_string($data->answer) : returnError("Answer not defined."));
        $wrong1 = (isset($data->wrong1) ? mysql_real_escape_string($data->wrong1) : returnError("Wrong answer 1 not defined."));
        $wrong2 = (isset($data->wrong2) ? mysql_real_escape_string($data->wrong2) : returnError("Wrong answer 2 not defined."));
        $wrong3 = (isset($data->wrong3) ? mysql_real_escape_string($data->wrong3) : returnError("Wrong answer 3 not defined."));
        $enabled = (isset($data->enabled) ? intval($data->enabled) : returnError("Enable status not defined."));

        $unPreparedSQL = "INSERT INTO questions (category, question, answer, wrong1, wrong2, wrong3, enabled) VALUES (:category, :question, :answer, :wrong1, :wrong2, :wrong3, :enabled)";

        $query = $connection->prepare($unPreparedSQL);
        $query->bindParam(':category', $category);
        $query->bindParam(':question', $question);
        $query->bindParam(':answer', $answer);
        $query->bindParam(':wrong1', $wrong1);
        $query->bindParam(':wrong2', $wrong2);
        $query->bindParam(':wrong3', $wrong3);
        $query->bindParam(':enabled', $enabled);

        $query->execute();
    }

    public function returnError($error) {
        http_response_code(400);
        die(json_encode(array('error' => $error)));
    }

    public function returnSuccess($message) {
        die(json_encode(array('success' => $message)));
    }
}
