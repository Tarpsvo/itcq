<?php
session_start();
if (isset($_SESSION['loggedin'])) {
?>
<div id="login-form-wrapper">
    <div id="login-data-box">
        <h1>Welcome, tarvo</h1>
    </div>
    <a href="#" class="button-yes">Go to admin web</a>
    <a href="#" class="button-no">Log out</a>
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
</div>

<?php }; ?>
