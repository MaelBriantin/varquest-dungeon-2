<?php
include_once "./back/controllers/UserController.php";

$newConnection = new UserController();
$newConnection->find($_POST['username'], $_POST['password']);

var_dump($_SESSION);

?>


<form action="" method="POST">
    <label>Username</label>
    <input type="text" name="username">
    <label>Password</label>
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
