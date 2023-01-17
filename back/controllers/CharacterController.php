<?php

include_once 'Controller.php';
require_once 'ClassController.php';
include_once 'EquipmentController.php';
class CharacterController extends Controller
{
    private string $table;
    private string $equipment;
    private string $quote;
    function __construct()
    {
        $this->table = "characters";
        $this->equipment = "equipment";
    }

    public function createNewCharacter ($name, $class) {

        $getStats = new ClassController();
        $stats = $getStats->find('name', $class);

        $values = [
            json_encode($name, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($class, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($stats['type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            $stats['hp'],
            $stats['hp'],
            $stats['dex'],
            $stats['str'],
            $stats['intel'],
        ];

        $sql = "INSERT INTO $this->table (name, class, class_type, max_hp, current_hp, dex, str, intel) VALUES (".implode(",", $values).")";
        $lastId = $this->postData($sql);
        $sql2 = "INSERT INTO $this->equipment (character_id) VALUES ($lastId)";
        $this->postData($sql2);
        return $this->findWithInventory($lastId);
    }

    public function create ($post): void
    {
        $values = [
            json_encode($post['name'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['class'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($post['class_type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            $post['hp'],
            $post['hp'],
            $post['dex'],
            $post['str'],
            $post['intel'],
        ];
        $sql = "INSERT INTO $this->table (name, class, max_hp, current_hp, dex, str, intel) VALUES (".implode(",", $values).")";
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
          'class' => json_encode($post['class'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
          'class_type' => json_encode($post['class_type'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
          'max_hp' => ['hp'],
          'current_hp' => ['hp'],
          'str' => ['str'],
          'dex' => ['dex'],
          'intel' => ['intel']
        ];

        $sql = "UPDATE $this->table SET
                name = ".$values['name']."
                class = ".$values['class']."
                class_type = ".$values['class_type']."
                max_hp = ".$values['max_hp']."
                current_hp = ".$values['current_hp']."
                str = ".$values['str']."
                dex = ".$values['dex']."
                intel = ".$values['intel']."
                WHERE id = $id";

        $this->postData($sql);

    }

    public function updateOne ($col, $value, $id)
    {
        if($col === 'name' OR $col === 'class' OR 'class_type'){
            $new_value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $new_value = $value;
        }
        $sql = "UPDATE $this->table SET $col = $new_value WHERE id = $id";
        $this->postData($sql);
    }

    public function updateLife ($operator, $hp, $character_id, $object_id = null)
    {
        $current_hp = $this->findValue('current_hp', $character_id)['current_hp'];
        $max_hp = $this->findValue('max_hp', $character_id)['max_hp'];
        $diff = $max_hp - $current_hp;
        if($operator === "more"){
            if($diff === 0){
                return "Vos points de vie sont déjà au maximum.";
            } else if(($current_hp + $hp) > $max_hp) {
                $updatedHp = $current_hp + $diff;
                $this->updateOne('current_hp', $updatedHp, $character_id);
                return "Vos PV ont été augmentés de $diff";
                //$removeObj = new InventoryController();
                //$removeObj->updateObjectInventory($character_id, $object_id, );
            } else {
                $updatedHp = $current_hp + $hp;
                $this->updateOne('current_hp', $updatedHp, $character_id);
                return "Vos PV ont été augmentés de $hp";
            }
        }
        if($operator === "less"){
            if(($current_hp - $hp) <= 0){
                $this->updateOne('current_hp', 0, $character_id);
                return "Vous êtes mort !";
            } else {
                $updatedHp = $current_hp - $hp;
                $this->updateOne('current_hp', $updatedHp, $character_id);
                return "Vous venez de perdre $hp PV. Vous aviez $current_hp PV, il vous reste à présent $updatedHp PV.";
            }
        }
    }

    public function index ()
    {
        $sql = "SELECT * FROM $this->table";
        return $this->getAllData($sql);
    }

    public function indexByClass ($class)
    {
        $class = json_encode($class);
        $sql = "SELECT * FROM $this->table WHERE class = $class";
        return $this->getAllData($sql);
    }

    public function find ($col, $value)
    {
        if($col === 'name' OR $col === 'class' OR $col === 'class_type'){
            $new_value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $new_value = $value;
        }
        $sql = "SELECT id, name, class, current_hp, max_hp, dex, str, intel FROM $this->table WHERE $col = $new_value";
        return $this->getData($sql);
    }

    public function findValue($col, $id){
        $sql = "SELECT $col FROM $this->table WHERE id = $id";
        return $this->getData($sql);
    }

    public function findById ($id)
    {
        $sql = "SELECT id, name, class, class_type, fight_count, current_hp, max_hp, dex, str, intel FROM $this->table WHERE id = $id";
        return $this->getData($sql);
    }

    public function findWithInventory ($id)
    {
        $findInventory = new InventoryController();
        $findEquipment = new EquipmentController();
        $character = new stdClass();
        $character->info = $this->findById($id);
        $character->damage = new stdClass();
        $character->damage->max = round((($character->info['str'] + $character->info['dex'] + $character->info['intel']) / 3) * 3);
        $character->damage->min = round((($character->damage->max) / 4) * 3);
        $character->equipment = $findEquipment->find($id);
        $character->inventory = $findInventory->find($id);
        return $character;
    }
}