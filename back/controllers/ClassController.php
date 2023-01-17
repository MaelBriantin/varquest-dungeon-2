<?php

include_once 'Controller.php';
//const TABLE = 'classes';
class ClassController extends Controller
{
    private string $table;

    function __construct()
    {
        $this->table = "classes";
    }

    public function create ($value): void
    {
        $values = [
            json_encode($value['name'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($value['type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($value['excerpt'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            $value['hp'],
            $value['dex'],
            $value['str'],
            $value['intel'],
        ];

        $sql = "INSERT INTO $this->table (name, type, excerpt, hp, dex, str, intel) VALUES (".implode(",", $values).")";
        $this->postData($sql);
    }

    public function delete ($id): void
    {
        $sql = "DELETE FROM $this->table WHERE id = $id";
        $this->postData($sql);
    }

    function updateAll ($post, $id): void
    {
        $values = [
          'name' => json_encode($post['name'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
          'type' => json_encode($post['type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
          'excerpt' => json_encode($post['excerpt'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
          'hp' => $post['hp'],
          'dex' => $post['dex'],
          'str' => $post['str'],
          'str' => $post['intel'],
        ];

        $sql = "UPDATE $this->table SET 
            name = ".$values['name'].", 
            type = ".$values['type'].", 
            hp = ".$values['excerpt'].", 
            hp = " .$values['hp'].", 
            dex = ".$values['dex'].", 
            dex = ".$values['str'].", 
            str = ".$values['intel']
            ." WHERE id = $id";
        $this->postData($sql);
    }

    function index ()
    {
        $sql = "SELECT * FROM $this->table";
        return $this->getAllData($sql);
    }


    function find ($col, $value)
    {
        //$is_string ? $new_value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : $new_value = $value;
        if($col === 'name' OR $col ==='excerpt' OR $col === 'type'){
            $new_value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $new_value = $value;
        }
        $sql = "SELECT name, type, excerpt, hp, str, dex, intel FROM $this->table WHERE $col = $new_value";
//        return $this->getData($sql);
        return $this->getData($sql);
    }
}