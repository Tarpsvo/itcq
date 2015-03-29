<?php
class postAPI {
    public function execute($connection, $request) {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data)) $this->returnError("POST data not received.");

        switch ($request) {
            case 'add':
                $this->restrictFunctionToAccount("admin");
                $this->addNewQuestion($connection, $data);
            break;

            case 'newcat':
                $this->restrictFunctionToAccount("admin");
                $this->addNewCategory($connection, $data);
            break;

            case 'qstData':
                $this->restrictFunctionToAccount("admin");
                $this->getQuestionData($connection, $data);
            break;

            case 'editQst':
                $this->restrictFunctionToAccount("admin");
                $this->editQuestion($connection, $data);
            break;

            case 'delQst':
                $this->restrictFunctionToAccount("admin");
                $this->deleteQuestion($connection, $data);
            break;

            case 'newacc':
                $this->restrictFunctionToAccount("admin");
                $this->createNewAccount($connection, $data);
            break;

            default:
                $this->returnError("Request not recognized.");
            break;
        }
    }

    private function deleteQuestion($connection, $data) {
        if (!isset($data->questionId)) $this->returnError("Question ID not set.");

        $unpreparedSQL = "DELETE FROM questions WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $data->questionId);
        $query->execute();

        $this->returnSuccess("Question successfully deleted.");
    }

    private function addNewQuestion($connection, $data) {
        $requiredValues = ['category', 'question', 'answer', 'wrong1', 'wrong2', 'wrong3', 'enabled'];
        $q = $this->checkData($data, $requiredValues);

        $unpreparedSQL = "INSERT INTO questions (category, question, answer, wrong1, wrong2, wrong3, enabled) VALUES (:category, :question, :answer, :wrong1, :wrong2, :wrong3, :enabled)";

        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':category', $q['category']);
        $query->bindParam(':question', $q['question']);
        $query->bindParam(':answer', $q['answer']);
        $query->bindParam(':wrong1', $q['wrong1']);
        $query->bindParam(':wrong2', $q['wrong2']);
        $query->bindParam(':wrong3', $q['wrong3']);
        $query->bindParam(':enabled', $q['enabled']);
        $query->execute();

        $this->returnSuccess("Question added.");
    }

    private function addNewCategory($connection, $data) {
        $categoryName = (isset($data->category)) ? $data->category : returnError("Category name not defined.");

        $unpreparedSQL = "INSERT INTO categories (name) VALUES (:category)";

        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':category', $categoryName);
        $query->execute();

        $this->returnSuccess("Category successfully added.");
    }

    private function editQuestion($connection, $data) {
        $requiredValues = ['category', 'question', 'answer', 'wrong1', 'wrong2', 'wrong3', 'enabled', 'id'];

        $q = $this->checkData($data, $requiredValues);

        $unpreparedSQL = "UPDATE questions SET category = :category, question = :question, answer = :answer, wrong1 = :wrong1, wrong2 = :wrong2, wrong3 = :wrong3, enabled = :enabled WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':category', $q['category']);
        $query->bindParam(':question', $q['question']);
        $query->bindParam(':answer', $q['answer']);
        $query->bindParam(':wrong1', $q['wrong1']);
        $query->bindParam(':wrong2', $q['wrong2']);
        $query->bindParam(':wrong3', $q['wrong3']);
        $query->bindParam(':enabled', $q['enabled']);
        $query->bindParam(':id', $q['id']);
        $query->execute();

        $this->returnSuccess("Question successfully edited.");
    }

    private function checkData($data, $required) {
        $integerKeys = ['id', 'enabled'];
        $maxLengths = [
                'id' => 10000000, // max value
                'enabled' => 1, // max value, in this case
                'category' => 255,
                'question' => 90,
                'answer' => 30,
                'wrong1' => 30,
                'wrong2' => 30,
                'wrong3' => 30
            ];
        $checkedValues = [];

        foreach ($data as $key => $value) {
            if (in_array($key, $required)) { // If is in required value list
                if (!isset($value)) returnError($key." not defined!");

                if (in_array($key, $integerKeys)) { // If integer, run integer checks
                    if (!is_numeric($value)) returnError($key." is not an integer!");
                    if ($value > $maxLengths[$key]) returnError($key." is too damn big!");
                    if ($value < 0) returnError($key. "is less than zero. Unrealistic.");
                } else {
                    if (strlen($value) > $maxLengths[$key]) returnError($key." is too damn long! Max length in characters: ".$maxLengths[$key]);
                }

                $checkedValues[$key] = $value;
                $required[array_search($key, $required)] = null;
            }
        }

        $requiredLeft = sizeof(array_filter($required));

        if ($requiredLeft > 0) {
            $error = "Following values were not set: ";
            foreach (array_filter($required) as $key => $value) {
                $error .= $value;
                if ($requiredLeft > 1) $error.= ", ";
                $requiredLeft--;
            }
            returnError($error);
        } else {
            return $checkedValues;
        }
    }

    private function createNewAccount($connection, $data) {
        if (!isset($data->username)) returnError("Username was not set!");
        if (!isset($data->password)) returnError("Password was not set!");
        if (!isset($data->account)) returnError("Account type was not set!");

        $usernameSQL = "SELECT * FROM users WHERE username = :username";
        $query = $connection->prepare($usernameSQL);
        $query->bindParam(':username', $data->username);
        $query->execute();
        if ($query->rowCount() > 0) returnError("Username already taken.");

        $salt = uniqid(mt_rand());
        $hashedPassword = $data->password.$salt;
        for ($i = 0; $i < 50; $i++) $hashedPassword = hash('sha256', $hashedPassword);

        $unpreparedSQL = "INSERT INTO users (username, password, account, salt) VALUES (:username, :password, :account, :salt)";

        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':username', $data->username);
        $query->bindParam(':password', $hashedPassword);
        $query->bindParam(':account', strtolower($data->account));
        $query->bindParam(':salt', $salt);
        $query->execute();

        $this->returnSuccess("Account successfully created.");
    }

    private function returnError($error) {
        http_response_code(400);
        die(json_encode(array('error' => $error)));
    }

    private function returnSuccess($message) {
        http_response_code(200);
        die(json_encode(array('success' => $message)));
    }

    private function restrictFunctionToAccount($account) {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if ($_SESSION['account'] !== $account) returnError("Not authorized to query this.");
    }
}
