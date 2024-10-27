<?php

require_once __DIR__ . '/../config/helpers.php';
use function Helpers\{env};

class Controller {


    public function postData ($sql) {
        try {
            $pdo = new PDO("mysql:host=".env('DB_HOST').":".env('DB_PORT').";dbname=".env('DB_NAME'), env('DB_USER'), env('DB_PASS'));
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->prepare($sql)->execute();
            return $pdo->lastInsertId();
        } catch (PDOException $e){
            echo "Error in Controller: " . $e->getMessage();
        }
    }

    public function getData ($sql) {
        try {
            $pdo = new PDO("mysql:host=".env('DB_HOST').":".env('DB_PORT').";dbname=".env('DB_NAME'), env('DB_USER'), env('DB_PASS'));
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
            $pdo = new PDO("mysql:host=".env('DB_HOST').":".env('DB_PORT').";dbname=".env('DB_NAME'), env('DB_USER'), env('DB_PASS'));
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sth = $pdo->prepare($sql);
            $sth->execute();
            return $sth->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo "Error in Controller: " . $e->getMessage();
        }
    }
}