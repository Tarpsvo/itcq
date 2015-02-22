<?php
class getAPI {
    public $sqlList = [
        'ql'    =>  "SELECT id, category, question, answer, enabled FROM questions",
        'cat'   =>  "SELECT name FROM categories",
        'qst'   =>  "SELECT id, question, answer, wrong1, wrong2, wrong3 FROM questions"
    ];

    public function execute($connection, $request) {
        switch ($request) {
            case 'stats':
                $this->getStatistics($connection);
            break;

            case 'qst':
                $this->getQuestion($connection);
            break;

            default:
                $this->returnAll($connection, $request);
            break;
        }
    }

    public function getStatistics($connection) {
        $numQuestions = "SELECT * FROM questions";
        $stats['numQuestions'] = $connection->query($numQuestions)->rowCount();

        if ($stats) {
            echo json_encode($stats);
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    public function getQuestion($connection) {
        $question = $connection->query($this->sqlList['qst']);

        if ($question) {
            $question = $question->fetchAll(PDO::FETCH_ASSOC);
            $key = array_rand($question);
            echo(json_encode($question[$key]));
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    public function returnAll($connection, $request) {
        $sql = $this->sqlList[$request];
        $queryResult = $connection->query($sql);

        if ($queryResult) {
            // Fetch assoc: returns data indexed by column names
            $queryResult = $queryResult->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($queryResult);
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    public function returnError($error) {
        http_response_code(400);
        die(json_encode(array('error' => $error)));
    }
}
?>
