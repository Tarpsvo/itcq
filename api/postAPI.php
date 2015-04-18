<?php
class postAPI {
    public function execute($connection, $request) {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data)) $this->returnError("POST data not received.");

        switch ($request) {
            case 'addNewQuestion':
                $this->restrictFunctionToAccount("admin");
                $this->addNewQuestion($connection, $data);
            break;

            case 'newCategory':
                $this->restrictFunctionToAccount("admin");
                $this->addNewCategory($connection, $data);
            break;

            case 'editQuestion':
                $this->restrictFunctionToAccount("admin");
                $this->editQuestion($connection, $data);
            break;

            case 'deleteQuestion':
                $this->restrictFunctionToAccount("admin");
                $this->deleteQuestion($connection, $data);
            break;

            case 'newAccount':
                $this->restrictFunctionToAccount("admin");
                $this->createNewAccount($connection, $data);
            break;

            case 'logQuestionAnswer':
                $this->logQuestionAnswer($connection, $data);
            break;

            case 'deleteAccount':
                $this->restrictFunctionToAccount("admin");
                $this->deleteAccount($connection, $data);
            break;

            case 'editAccount':
                $this->restrictFunctionToAccount("admin");
                $this->editAccount($connection, $data);
            break;

            case 'addQuestionSuggestion':
                $this->addQuestionSuggestion($connection, $data);
            break;

            case 'deleteSuggestion':
                $this->deleteSuggestion($connection, $data);
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
        $requiredValues = ['category', 'question', 'answer', 'wrong1', 'wrong2', 'wrong3', 'enabled', 'level'];
        $q = $this->checkData($data, $requiredValues);

        $unpreparedSQL = "INSERT INTO questions (category, question, answer, wrong1, wrong2, wrong3, enabled, level) VALUES (:category, :question, :answer, :wrong1, :wrong2, :wrong3, :enabled, :level)";

        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':category', $q['category']);
        $query->bindParam(':question', $q['question']);
        $query->bindParam(':answer', $q['answer']);
        $query->bindParam(':wrong1', $q['wrong1']);
        $query->bindParam(':wrong2', $q['wrong2']);
        $query->bindParam(':wrong3', $q['wrong3']);
        $query->bindParam(':enabled', $q['enabled']);
        $query->bindParam(':level', $q['level']);
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
        $requiredValues = ['category', 'question', 'answer', 'wrong1', 'wrong2', 'wrong3', 'enabled', 'id', 'level'];

        $q = $this->checkData($data, $requiredValues);

        $unpreparedSQL = "UPDATE questions SET category = :category, question = :question, answer = :answer, wrong1 = :wrong1, wrong2 = :wrong2, wrong3 = :wrong3, enabled = :enabled, level = :level WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':category', $q['category']);
        $query->bindParam(':question', $q['question']);
        $query->bindParam(':answer', $q['answer']);
        $query->bindParam(':wrong1', $q['wrong1']);
        $query->bindParam(':wrong2', $q['wrong2']);
        $query->bindParam(':wrong3', $q['wrong3']);
        $query->bindParam(':enabled', $q['enabled']);
        $query->bindParam(':id', $q['id']);
        $query->bindParam(':level', $q['level']);
        $query->execute();

        $this->returnSuccess("Question successfully edited.");
    }

    private function checkData($data, $required) {
        $integerKeys = ['id', 'enabled', 'level'];
        $maxLengths = [
                'id' => 10000, // max value
                'enabled' => 1, // max value, in this case
                'level' => 10,
                'category' => 255,
                'question' => 90,
                'answer' => 30,
                'wrong1' => 30,
                'wrong2' => 30,
                'wrong3' => 30,
                'username' => 20
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

        $usernameSQL = "SELECT 1 FROM users WHERE username = :username";
        $query = $connection->prepare($usernameSQL);
        $query->bindParam(':username', $data->username);
        $query->execute();
        if ($query->rowCount() > 0) returnError("Username already taken.");

        $salt = uniqid(mt_rand());
        $hashedPassword = $data->password.$salt;
        for ($i = 0; $i < 50; $i++) $hashedPassword = hash('sha256', $hashedPassword);

        $unpreparedSQL = "INSERT INTO users (username, password, account, salt) VALUES (:username, :password, :account, :salt)";
        $account = strtolower($data->account);

        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':username', $data->username);
        $query->bindParam(':password', $hashedPassword);
        $query->bindParam(':account', $account);
        $query->bindParam(':salt', $salt);
        $query->execute();

        $this->returnSuccess("Account successfully created.");
    }

    private function logQuestionAnswer($connection, $data) {
        if (!isset($data->questionId)) returnError("Logging error: question ID not set.");
        else if (!is_numeric($data->questionId)) returnError("Logging error: question ID not a number.");
        if (!isset($data->answer_correct)) returnError("Logging error: answer correct status not set.");
        else if (!is_bool($data->answer_correct)) returnError("Logging error: answer status not a boolean.");
        if (!isset($data->answer)) returnError("Logging error: answer not set.");

        if (session_status() === PHP_SESSION_NONE) session_start();
        $user = (isset($_SESSION['username'])) ? $_SESSION['username'] : '';

        $unpreparedSQL = "INSERT INTO statistics (question_id, answer_correct, answer, user) VALUES (:questionId, :answerCorrect, :answer, :user)";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':questionId', $data->questionId);
        $query->bindParam(':answerCorrect', $data->answer_correct);
        $query->bindParam(':answer', $data->answer);
        $query->bindParam(':user', $user);
        $query->execute();

        $this->returnSuccess("Successfully logged.");
    }

    private function deleteAccount($connection, $data) {
        if (!isset($data->accountId)) $this->returnError("Account ID not set.");

        $unpreparedSQL = "DELETE FROM users WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $data->accountId);
        $query->execute();

        $this->returnSuccess("Account successfully deleted.");
    }

    private function editAccount($connection, $data) {
        $idUsername = '';
        $accountTypes = ['admin', 'user'];
        if (!isset($data->accountId)) returnError("Account ID was not set!");
        if (!isset($data->username)) returnError("Username not set!");
        if (!isset($data->account)) returnError("Account type not set!");
        else if (!in_array($data->account, $accountTypes)) returnError("This account type does not exist!");

        $requiredValues = ['username'];
        $q = $this->checkData($data, $requiredValues);

        $sameUsernameSQL = "SELECT username FROM users WHERE id = :id";
        $query = $connection->prepare($sameUsernameSQL);
        $query->bindParam(':id', $data->accountId);
        $query->execute();
        if ($query->rowCount() > 0) $idUsername = $query->fetchAll(PDO::FETCH_ASSOC)[0]['username'];

        /* If the id-s username is not the same as the new one, check if it already exists in other rows */
        if ($idUsername != $data->username) {
            $usernameSQL = "SELECT 1 FROM users WHERE username = :username";
            $query = $connection->prepare($usernameSQL);
            $query->bindParam(':username', $q['username']);
            $query->execute();
            if ($query->rowCount() > 0) returnError("Username already taken.");
        }

        $unpreparedSQL = "UPDATE users SET username = :username, account = :account WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $data->accountId);
        $query->bindParam(':username', $q['username']);
        $query->bindParam(':account', $data->account);
        $query->execute();

        $this->returnSuccess("Account successfully edited.");
    }

    private function addQuestionSuggestion($connection, $data) {
        $requiredValues = ['question', 'answer', 'wrong1', 'wrong2', 'wrong3'];

        $q = $this->checkData($data, $requiredValues);

        if (isset($data->imageUrl)) {
            if ($this->checkImageLink($data->imageUrl)) {
                $imageUrl = $data->imageUrl;
            } else {
                returnError("Image link was not valid.");
            }
        } else {
            $imageUrl = '';
        }

        $unpreparedSQL = "INSERT INTO suggestions (question, correct_answer, wrong1, wrong2, wrong3, image_url, ip) VALUES (:question, :answer, :wrong1, :wrong2, :wrong3, :image_url, :ip)";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':question', $q['question']);
        $query->bindParam(':answer', $q['answer']);
        $query->bindParam(':wrong1', $q['wrong1']);
        $query->bindParam(':wrong2', $q['wrong2']);
        $query->bindParam(':wrong3', $q['wrong3']);
        $query->bindParam(':image_url', $imageUrl);
        $query->bindParam(':ip', $_SERVER['REMOTE_ADDR']);
        $query->execute();

        $this->returnSuccess("Question suggestion successfully posted.");
    }

    private function deleteSuggestion($connection, $data) {
        if (!isset($data->suggestionId)) $this->returnError("Suggestion ID was not set.");

        $unpreparedSQL = "DELETE FROM suggestions WHERE id = :id LIMIT 1";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $data->suggestionId);
        $query->execute();

        $this->returnSuccess("Suggestion successfully deleted.");
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
        if (!isset($_SESSION['account']) || $_SESSION['account'] != $account) returnError("Not authorized to query this.");
    }

    function checkImageLink($link) {
        if (isset($link)) {
            if (filter_var($link, FILTER_VALIDATE_URL)){
                if (strpos(get_headers($link)[0], '200')) {
                    $imageData = getimagesize($link);
                    if (isset($imageData)) {
                        if ($imageData['mime'] == 'image/jpeg') {
                            return true;
                        } else {
                            returnError("Given image was not JPG. Please use only JPG format images.");
                        }
                    } else {
                        returnError("Specified image URL did not contain an image.");
                        return false;
                    }
                } else {
                    returnError("Specified image link does not work properly, please check it.");
                }
            } else {
                returnError("Specified image URL is not in correct format.");
                return false;
            }
        } else {
            returnError("Link check error: this should not happen.");
            return false;
        }
    }
}
