<?php

require_once 'Controller.php';
require_once 'ObjectController.php';
require_once 'CharacterController.php';

class InventoryController extends Controller
{
    private string $table;
    function __construct()
    {
        $this->table = "inventories";
    }


    public function create ($character_id, $object_id, $qty)
    {
        $sql = "INSERT INTO $this->table (character_id, object_id, quantity) VALUES ($character_id, $object_id, $qty)";
        $this->postData($sql);
    }

    public function delete ($id)
    {
        $sql = "DELETE FROM $this->table WHERE id = $id";
        $this->postData($sql);
    }

    public function update ($character_id, $object_id, $qty, $id)
    {
        $sql = "UPDATE $this->table SET 
                 character_id = $character_id,
                 object_id = $object_id,
                 quantity = $qty
                 WHERE id =$id";

        $this->postData($sql);
    }

    public function updateObjectInventory ($character_id, $operator, $obj_id, $qty)
    {
        $inventory = $this->find($character_id);
        $objectUpdated = new ObjectController();
        $object = $objectUpdated->findById($obj_id)['name'];
        $objectId = [];
        foreach ($inventory as $item){
            $objectId[$item['inventories_id']] = $item['object_id'];
        }

        if($objectId != []) {
            if(in_array($obj_id, array_values($objectId))){
                $inventory_id = array_search($obj_id, $objectId);
                $actualQty = $this->findQty($inventory_id)['quantity'];
                if($qty === '0'){
                    $this->delete($inventory_id);
                    return $object." a été supprimé de votre inventaire.";
                } else if($operator === 'more') {
                    $newQty = $actualQty + $qty;
                    $this->update($character_id, $obj_id, $newQty, $inventory_id);
                    return "Vous avez à présent $newQty $object dans votre inventaire.";
                } else if ($operator === 'less'){
                    $newQty = $actualQty - $qty;
                    if($newQty <= 0){
                        $this->delete($inventory_id);
                        return "$object a été supprimé de votre inventaire";
                    } else {
                        $this->update($character_id, $obj_id, $newQty, $inventory_id);
                        return "Vous avez à présent $newQty $object dans votre inventaire.";
                    }
                }
            } else {
                $this->create($character_id, $obj_id, $qty);
                return $object." a été ajouté à votre inventaire.";
            }
        } else if($objectId === [] AND $qty != '0') {
            $this->create($character_id, $obj_id, $qty);
            if($qty > 1){
                return "L'objet ".$object." a été ajouté à votre inventaire (x".$qty.").";
            } else {
                return "L'objet ".$object." a été ajouté à votre inventaire";
            }
        } else {
            return "Oups... mieux vaut éviter de mettre des trucs étranges dans vos poches...";
        }
    }

    public function index ()
    {

        $sql = "SELECT inventories.*,
            characters.name AS character_name,
            objects.id AS object_id, 
            objects.name AS object_name, 
            objects.type AS object_type,
            objects.description AS object_description,
            objects.properties AS object_properties,
            objects.class AS object_class,
            objects.genre AS object_genre
                FROM inventories
                INNER JOIN objects 
                    ON inventories.object_id = objects.id
                INNER JOIN characters
                    ON inventories.character_id = characters.id";
        return $this->getAllData($sql);

    }
    public function find ($character_id)
    {

        $sql = "SELECT  inventories.id AS inventories_id, 
            objects.id AS object_id, 
            objects.name AS object_name, 
            objects.type AS object_type,
            objects.description AS object_description,
            objects.class AS object_class,
            objects.properties AS object_properties,
            inventories.quantity
                FROM inventories
                INNER JOIN objects 
                    ON inventories.object_id = objects.id
                INNER JOIN characters
                    ON inventories.character_id = characters.id
                WHERE inventories.character_id = $character_id";
        return $this->getAllData($sql);

    }

    public function findObject ($character_id, $object_id)
    {

        $sql = "SELECT  inventories.id AS inventories_id, 
            objects.id AS object_id, 
            objects.name AS object_name, 
            objects.type AS object_type,
            objects.description AS object_description,
            objects.class AS object_class,
            objects.properties AS object_properties,
            inventories.quantity
                FROM inventories
                INNER JOIN objects 
                    ON inventories.object_id = objects.id
                INNER JOIN characters
                    ON inventories.character_id = characters.id
                WHERE inventories.character_id = $character_id
                    AND inventories.object_id = $object_id";
        return $this->getData($sql);

    }

    public function findQty ($id){
        $sql = "SELECT quantity FROM $this->table WHERE id = $id";
        return $this->getData($sql);
    }

}