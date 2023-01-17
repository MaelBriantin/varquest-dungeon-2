<?php

session_start();

include_once "./back/controllers/UserController.php";


function connection ($username, $password)
{
    $connection = new UserController();
    $user = $connection->find($username, $password);

    if($user){
        $_SESSION['user_id'] = $user['id'];
        return 'connected';
    } else {
        return 'not connected';
    }
}
