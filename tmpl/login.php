<?php
session_start();
if (isset($_SESSION['username'])) {
?>
<div id="login-form-wrapper">
    <div id="login-data-box" class="absolute-center">
        <h1>You're logged in as: <?php echo $_SESSION['username']; ?></h1>
        <a href="/admin" class="button-yes text-shadow">Go to admin web</a>
        <a class="button-no text-shadow" data-ng-click="logout()">Log out</a>
    </div>
</div>



<?php
} else {
?>

<div id="login-form-wrapper" data-ng-controller="LoginController">
    <form data-ng-submit="login(credentials)">
        <input type="text" name="username" value="" placeholder="Username" data-ng-model="credentials.username" required />
        <input type="password" name="password" value="" placeholder="Password" data-ng-model="credentials.password" required />
        <input type="submit" class="button-yes text-shadow" id="submit-button" value="Login" />
    </form>

    <h3>or</h3>

    <a href="#/suggest" id="suggest-button" class="button-yes box-shadow text-shadow">Suggest a question</a>
</div>

<?php }; ?>
