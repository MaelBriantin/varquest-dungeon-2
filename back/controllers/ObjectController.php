<?php

include_once 'Controller.php';
class ObjectController extends Controller
{
    private string $table;
    function __construct()
    {
        $this->table = "objects";
    }

    public function create ($post): void
    {
        $values = [
            json_encode($post['name'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['class'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['description'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['properties'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['genre'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ];
        $sql = "INSERT INTO $this->table (name, type, description, properties, genre) VALUES (".implode(",", $values).")";
        $this->postData($sql);
    }

    public function delete ($id): void
    {
        $sql = "DELETE FROM $this->table WHERE id = $id";
        $this->postData($sql);
    }

    public function updateAll ($post, $id)
    {
        $values = [
            'name' => json_encode($post['name'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'type' => json_encode($post['type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'class' => json_encode($post['class'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'description' => json_encode($post['description'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'properties' => json_encode($post['properties'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'genre' => json_encode($post['genre'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ];

        $sql = "UPDATE $this->table SET
                name = ".$values['name']."
                type = ".$values['type']."
                type = ".$values['class']."
                description = ".$values['description']."
                properties = ".$values['properties']."
                genre = ".$values['genre']."
                WHERE id = $id";

        $this->postData($sql);

    }

    public function updateOne ($col, $value, $is_string, $id)
    {
        $is_string ? $new_value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : $new_value = $value;

        $sql = "UPDATE $this->table SET $col = $new_value WHERE id = $id";
        $this->postData($sql);
    }

    public function index ()
    {
        $sql = "SELECT * FROM $this->table";
        return $this->getAllData($sql);
    }

    public function IndexByType ($value)
    {
        $value = json_encode($value);
        $sql = "SELECT * FROM $this->table WHERE type = $value ORDER BY id DESC";
        return $this->getAllData($sql);
    }

    public function findById ($id)
    {
        $sql = "SELECT * FROM $this->table WHERE id = $id";
        return $this->getData($sql);
    }

    public function randomSelect ($type, $qty){
        $type = json_encode($type);
        $sql = "SELECT id, name, type, class, description, properties, genre FROM $this->table WHERE type = $type ORDER BY RAND() LIMIT $qty";
        if($qty === 1){
            return $this->getData($sql);
        } else {
            return $this->getAllData($sql);
        }
    }

    public function randomSelectAlt ($qty){
        $sql = "SELECT id, name, type, class, description, properties, genre FROM $this->table ORDER BY RAND() LIMIT $qty";
        if($qty === 1){
            return $this->getData($sql);
        } else {
            return $this->getAllData($sql);
        }
    }
}