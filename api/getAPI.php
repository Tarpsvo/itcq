<?php
class getAPI {
    private $sqlList = [
        'questionList'      =>  "SELECT id, category, question, answer, enabled, level FROM questions",
        'categoryList'      =>  "SELECT name FROM categories",
        'question'          =>  "SELECT id, question, answer, wrong1, wrong2, wrong3, has_image FROM questions WHERE enabled = 1",
        'accountList'       =>  "SELECT id, username, account, lastip FROM users",
        'suggestionList'    =>  "SELECT id, question, correct_answer, wrong1, wrong2, wrong3, ip FROM suggestions"
    ];

    public function execute($connection, $request, $id) {
        switch ($request) {
            case 'stats':
                $this->getStatistics($connection);
            break;

            case 'question':
                $this->getQuestion($connection);
            break;

            case 'questionData':
                $this->restrictFunctionToAccount("user");
                $this->getQuestionData($connection, $id);
            break;

            case 'accountData':
                $this->restrictFunctionToAccount("admin");
                $this->getAccountData($connection, $id);
            break;

            case 'suggestionData':
                $this->restrictFunctionToAccount("user");
                $this->getSuggestionData($connection, $id);
            break;

            default:
                $this->returnAll($connection, $request);
            break;
        }
    }

    private function getStatistics($connection) {
        $numQuestions = "SELECT 1 FROM questions";
        $stats['numQuestions'] = $connection->query($numQuestions)->rowCount();

        $numCategories = "SELECT 1 FROM categories";
        $stats['numCategories'] = $connection->query($numCategories)->rowCount();

        $numAnswers = "SELECT 1 FROM statistics";
        $stats['numAnswers'] = $connection->query($numAnswers)->rowCount();

        $numCorrectAnswers = "SELECT 1 FROM statistics WHERE answer_correct = 1";
        $stats['numCorrectAnswers'] = $connection->query($numCorrectAnswers)->rowCount();

        $numAnswersByAnon = "SELECT 1 FROM statistics WHERE user = ''";
        $stats['numAnswersByAnon'] = $connection->query($numAnswersByAnon)->rowCount();

        $stats['correctPercentage'] = round($stats['numCorrectAnswers'] / $stats['numAnswers'] * 100, 1);

        if ($stats) {
            echo json_encode($stats);
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    private function getQuestion($connection) {
        $question = $connection->query($this->sqlList['question']);

        if ($question) {
            $question = $question->fetchAll(PDO::FETCH_ASSOC);
            $key = array_rand($question);
            echo(json_encode($question[$key]));
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    private function returnAll($connection, $request) {
        if ($request == 'accountList') $this->restrictFunctionToAccount("admin");

        $sql = $this->sqlList[$request];
        $queryResult = $connection->query($sql);

        if ($queryResult) {
            $queryResult = $queryResult->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($queryResult);
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    private function getQuestionData($connection, $id) {
        if (!isset($id)) returnError("ID not defined.");

        $unpreparedSQL = "SELECT category, question, answer, wrong1, wrong2, wrong3, enabled, level, has_image FROM questions WHERE id = :id";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $id);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() == 0) {
            $this->returnError("Question not found!");
        } else {
            echo json_encode($data[0]);
        }
    }

    private function getAccountData($connection, $id) {
        if (!isset($id)) returnError("ID not defined.");

        $unpreparedSQL = "SELECT username, account, modified, lastip FROM users WHERE id = :id";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $id);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() == 0) {
            $this->returnError("Account not found!");
        } else {
            echo json_encode($data[0]);
        }
    }

    private function getSuggestionData($connection, $id) {
        if (!isset($id)) returnError("ID not defined.");

        $unpreparedSQL = "SELECT id, question, correct_answer, wrong1, wrong2, wrong3, ip, image_url FROM suggestions WHERE id = :id";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $id);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() == 0) {
            $this->returnError("Suggestion not found!");
        } else {
            echo json_encode($data[0]);
        }
    }

    private function returnError($error) {
        http_response_code(400);
        die(json_encode(array('error' => $error)));
    }

    private function restrictFunctionToAccount($account) {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (isset($_SESSION['account'])) {
            if ($account != $_SESSION['account']) {
                if (!($_SESSION['account'] == 'admin' && $account == 'user')) returnError("Not authorized to query this.");
            }
        } else {
            returnError("Not authorized to query this (account type not set).");
        }
    }
}
