<?php
class getAPI {
    private $sqlList = [
        'ql'    =>  "SELECT id, category, question, answer, enabled FROM questions",
        'cat'   =>  "SELECT name FROM categories",
        'qst'   =>  "SELECT id, question, answer, wrong1, wrong2, wrong3 FROM questions WHERE enabled = 1",
        'al'    =>  "SELECT id, username, account, lastip FROM users"
    ];

    public function execute($connection, $request, $id) {
        switch ($request) {
            case 'stats':
                $this->getStatistics($connection);
            break;

            case 'qst':
                $this->getQuestion($connection);
            break;

            case 'qstData':
                $this->getQuestionData($connection, $id);
            break;

            default:
                $this->returnAll($connection, $request);
            break;
        }
    }

    private function getStatistics($connection) {
        $numQuestions = "SELECT id FROM questions";
        $stats['numQuestions'] = $connection->query($numQuestions)->rowCount();
        $numCategories = "SELECT id FROM categories";
        $stats['numCategories'] = $connection->query($numCategories)->rowCount();

        if ($stats) {
            echo json_encode($stats);
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    private function getQuestion($connection) {
        $question = $connection->query($this->sqlList['qst']);

        if ($question) {
            $question = $question->fetchAll(PDO::FETCH_ASSOC);
            $key = array_rand($question);
            echo(json_encode($question[$key]));
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    private function returnAll($connection, $request) {
        if ($request == 'al') $this->restrictFunctionToAccount("admin");

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
        $this->restrictFunctionToAccount("admin");
        if (!isset($id)) returnError("ID not defined.");

        $unpreparedSQL = "SELECT category, question, answer, wrong1, wrong2, wrong3, enabled FROM questions WHERE id = :id";
        $query = $connection->prepare($unpreparedSQL);
        $query->bindParam(':id', $id);
        $query->execute();
        $data = $query->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($data[0]);
    }

    private function returnError($error) {
        http_response_code(400);
        die(json_encode(array('error' => $error)));
    }

    private function restrictFunctionToAccount($account) {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if ($_SESSION['account'] !== $account) returnError("Not authorized to query this.");
    }
}
