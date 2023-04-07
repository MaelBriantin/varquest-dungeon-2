<?php
////////////////////////////////////DB config/////////////////////////////////////////

const SERVER_NAME = 'localhost';
const DB_NAME = 'varquest_dungeon';
const USERNAME = 'root';
const PASSWORD = 'password';

//////////////////////////////////////////////////////////////////////////////////////

require_once 'Controller.php';

class Controller
{
    function __construct()
    {

    }

    public function postData ($sql) {
        try {
            $pdo = new PDO("mysql:host=".SERVER_NAME.";dbname=".DB_NAME, USERNAME, PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->prepare($sql)->execute();
            return $pdo->lastInsertId();
        } catch (PDOException $e){
            echo "Error in Controller: " . $e->getMessage();
        }
    }

    public function getData ($sql) {
        try {
            $pdo = new PDO("mysql:host=".SERVER_NAME.";dbname=".DB_NAME, USERNAME, PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sth = $pdo->prepare($sql);
            $sth->execute();
            return $sth->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Error in Controller: " . $e->getMessage();
        }
    }

    public function getAllData ($sql) {
        try {
            $pdo = new PDO("mysql:host=".SERVER_NAME.";dbname=".DB_NAME, USERNAME, PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sth = $pdo->prepare($sql);
            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Error in Controller: " . $e->getMessage();
        }
    }
}