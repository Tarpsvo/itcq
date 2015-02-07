<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>The IT College Quiz</title>

        <link rel="stylesheet" href="css/cssreset.css"> <!-- Eric Meyer's Reset CSS v2.0 - http://cssreset.com -->
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/quiz.css">
    </head>

    <body>
        <div id="header">
            <a href="#/about" id="about-button" class="box-shadow change-content main">ABOUT</a>
            <a href="#/statistics" id="statistics-button" class="box-shadow change-content main">STATISTICS</a>
            <a href="#/main" id="back-button" class="box-shadow change-content">BACK TO MAIN</a>
        </div>

        <div id="dynamic-content">
            <!-- The contents of this div should be changed dynamically through JavaScript. -->
            <div id="intro-content">
                <h1 id="itcq-title">ITCQ</h1>
                <h2 id="itcq-subtitle">The IT College Quiz</h2>

                <a href="#/quiz" id="itcq-start" class="box-shadow">START</a>
            </div>
        </div>

    <script src="/js/jquery-2.1.3.min.js"></script>
    <script src="/js/menu.js"></script>
    <script src="/js/quiz.js"></script>
    <script src="/js/content.js"></script>
    </body>
</html>
