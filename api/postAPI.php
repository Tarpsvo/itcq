<?php
class postAPI {
    public function execute($connection, $request) {
        // Get whole POST input: http://php.net/manual/en/wrappers.php.php#wrappers.php.input
        $data = json_decode(file_get_contents("php://input"));
        switch ($request) {
            case 'add':
                $this->addNewQuestion($connection, $this->validateData($data));
                $this->returnSuccess("Query executed.");
            break;
        }
    }

    public function validateData($data) {
        if (isset($data->enabled) && $data->enabled == 'true') $data->enabled = '1'; else $data->enabled = '0';

        if (!$data->question || !$data->category || !$data->answer || !$data->wrong) $this->returnError("One mandatory field was empty.");

        return $data;
    }

    public function addNewQuestion($connection, $data) {
        $category = mysql_real_escape_string($data->category->name);
        $question = mysql_real_escape_string($data->question);
        $answer = mysql_real_escape_string($data->answer);
        $wrong = mysql_real_escape_string($data->wrong);
        $enabled = intval($data->enabled);

        $sql = "INSERT INTO questions (category, question, answer, wrongs, enabled) VALUES ('$category', '$question', '$answer', '$wrong', '$enabled')";

        $connection->exec($sql);
    }

    public function returnError($error) {
        die(json_encode(array('error' => $error)));
    }

    public function returnSuccess($message) {
        die(json_encode(array('success' => $message)));
    }
}
