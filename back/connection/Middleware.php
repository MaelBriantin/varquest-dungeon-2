<?php

class Middleware
{
    public function isConnected ()
    {
        isset($_SESSION['user_id']) ? $connect = true : $connect = false;
        return $connect;
    }
}