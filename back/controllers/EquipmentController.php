<?php

require_once 'Controller.php';
require_once 'ObjectController.php';
require_once 'CharacterController.php';
require_once 'ClassController.php';
require_once __DIR__ . '/../config/helpers.php';
use function Helpers\{env};

class EquipmentController extends Controller
{
    private string $table;
    function __construct()
    {
        $this->table = "equipment";
    }


    public function create ($character_id, $weapon_id=null, $armor_id=null)
    {
        //creation at character creation
    }

    public function delete ($character_id, $type)
    {
        $actualInventory = $this->find($character_id);
        $id = $actualInventory['equipment_id'];
        if ($type === "Arme"){
            $sql = "UPDATE $this->table SET weapon_id = NULL, weapon_modifier = NULL WHERE id = $id";
        }
        if ($type === "Armure"){
            $sql = "UPDATE $this->table SET armor_id = NULL, armor_modifier = NULL WHERE id = $id";
        }
        $this->postData($sql);
        return "Equipement supprimé";
    }

    public function updateAll ($character_id, $weapon_id, $armor_id)
    {

    }

    public function updateWeapon ($character_id, $weapon_id)
    {
        $findCharacter = new CharacterController();
        $character_class = $findCharacter->findById($character_id)['class'];

        $findClassType = new ClassController();
        $classType = $findClassType->find('name', $character_class);

        $findObject = new ObjectController();
        $weapon = $findObject->findById($weapon_id);
        $weapon_modifier = json_encode($weapon['properties'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if($weapon['type'] === 'Arme'){
            if($weapon['class'] != $classType['type'] AND $weapon['class'] != 'Toutes'){
                return "Votre classe ne vous permet pas de vous équiper de ce type d'arme.";
            } else {
                $sql = "UPDATE $this->table SET 
                 weapon_id = $weapon_id,
                 weapon_modifier = $weapon_modifier
                 WHERE character_id = $character_id";
                $this->postData($sql);
                return $weapon['name']." est désormais équipé.";
            }
        } else {
            return "Vous ne pouvez équiper une armure sur un emplacement prévu pour une arme.";
        }
    }

    public function updateArmor ($character_id, $armor_id)
    {
        $findCharacter = new CharacterController();
        $character_class = $findCharacter->findById($character_id)['class'];

        $findClassType = new ClassController();
        $classType = $findClassType->find('name', $character_class);

        $findObject = new ObjectController();
        $armor = $findObject->findById($armor_id);
        $armor_modifier = json_encode($armor['properties'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if($armor['type'] === 'Armure'){
            if($armor['class'] != $classType['type'] AND $armor['class'] != 'Toutes'){
                return "Votre classe ne vous permet pas de vous équiper de ce type d'armure.";
            } else {
                $sql = "UPDATE $this->table SET 
                 armor_id = $armor_id,
                 armor_modifier = $armor_modifier
                 WHERE character_id = $character_id";
                $this->postData($sql);
                return $armor['name']." est désormais équipé.";
            }
        } else {
            return "Vous ne pouvez équiper une arme sur un emplacement prévu pour une armure.";
        }
    }


    public function index ()
    {

        $sql = "SELECT equipment.*,
            characters.name AS character_name,
            objects.id AS object_id, 
            objects.name AS object_name, 
            objects.type AS object_type,
            objects.description AS object_description,
            objects.class AS object_class,
            objects.genre AS object_genre
                FROM equipment
                INNER JOIN objects 
                    ON equipment.object_id = objects.id
                INNER JOIN characters
                    ON equipment.character_id = characters.id";
        return $this->getAllData($sql);

    }
    public function find ($character_id)
    {
        $sql = "SELECT  equipment.id AS equipment_id,
            weapon.id AS weapon_id,
            weapon.name AS weapon_name,
            weapon.type AS weapon_type,
            weapon.description AS weapon_description,
            weapon.properties AS weapon_properties,
            weapon.class AS weapon_class,
            armor.id AS armor_id,
            armor.name AS armor_name,
            armor.type AS armor_type,
            armor.description AS armor_description,
            armor.properties AS armor_properties,
            armor.class AS armor_class
                FROM equipment
                LEFT JOIN ".env('DB_NAME').".objects AS weapon
                    ON equipment.weapon_id = weapon.id
                LEFT JOIN ".env('DB_NAME').".objects AS armor
                    ON equipment.armor_id = armor.id
                WHERE equipment.character_id = $character_id";
        return $this->getData($sql);
    }

}