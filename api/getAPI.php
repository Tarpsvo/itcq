<?php
class getAPI {
    public $sqlList = [
        'ql'    => "SELECT id, category, question, answer, enabled FROM questions",
        'cat'   => "SELECT name FROM categories"
    ];

    public function execute($connection, $request) {
        $sql = $this->sqlList[$request];

        $queryResult = $connection->query($sql);

        if ($queryResult) {
            // Fetch assoc: returns data indexed by column names
            $queryResult = $queryResult->fetchAll(PDO::FETCH_ASSOC);
            $json = json_encode($queryResult);
            echo $json;
        } else {
            $this->returnError("Query didn't return any results.");
        }
    }

    public function returnError($error) {
        die(json_encode(array('error' => $error)));
    }
}
?>
