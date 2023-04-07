<?php
session_start();

include_once __DIR__.'/../controllers/CharacterController.php';
include_once __DIR__.'/../controllers/ClassController.php';
include_once __DIR__.'/../controllers/InventoryController.php';
include_once __DIR__.'/../controllers/EventController.php';
include_once __DIR__.'/../controllers/EquipmentController.php';
include_once __DIR__.'/../controllers/UserController.php';
include_once __DIR__.'/../connection/Middleware.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$isConnected = new Middleware();
$connected = $isConnected->isConnected();


/*if(isset($_GET) AND !$connected)
{
    if (isset($_GET['create']) AND $_GET['create'] === 'connection'){
        $createConnection = new UserController();
        echo json_encode($createConnection->find($_GET['username'], $_GET['password']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        //$createConnection->find($_GET['username'], $_GET['password']);
        //echo json_encode($connected, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
else if(isset($_GET) AND $connected)
{*/
if(isset($_GET)){
    //CREATE
    if(isset($_GET['create'])){

        if($_GET['create'] === 'character'){
            //request parameters = name(=string), class(=string)
            $createCharacter = new CharacterController();
            //$createCharacter->createNewCharacter($_GET['name'], $_GET['class']);
            echo json_encode($createCharacter->createNewCharacter($_GET['name'], $_GET['class']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            //$response = "Personnage créé avec succès.";
            //echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['create'] === 'class'){
            //request parameters = name(=string), excerpt(=string), hp(=int), dex(=int), str(=int)
            $createClass = new ClassController();
            $createClass->create($_GET);
            $response = "Classe crée avec succès.";
            echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['create'] === 'event'){
            $createEvent = new EventController();
            if(isset($_GET['qty'])){
                echo json_encode($createEvent->createNewEvent($_GET['qty']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            if(!isset($_GET['qty']) AND !isset($_GET['type'])){
                echo json_encode($createEvent->createNewEvent(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            if(isset($_GET['type']) AND !isset($_GET['qty'])){
                echo json_encode($createEvent->createNewEventByType($_GET['type']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }


    }

    //DELETE
    if(isset($_GET['delete'])){

        if($_GET['delete'] === 'character'){
            //request parameters = id(=int)
            $deleteCharacter = new CharacterController();
            $deleteCharacter->delete($_GET['id']);
            $response = "Personnage supprimé avec succès.";
            echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['delete'] === 'class'){
            //request parameters = id(=int)
            $deleteClass = new ClassController();
            $deleteClass->delete($_GET['id']);
            $response = "Classe supprimée avec succès.";
            echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['delete'] === 'equipment'){
            $deleteItem = new EquipmentController();
            $response = $deleteItem->delete($_GET['character_id'], $_GET['object_type']);
            echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

    }

    //UPDATE
    if(isset($_GET['update'])){

        if($_GET['update'] === 'life'){
            $updateLife = new CharacterController();
            echo json_encode($updateLife->updateLife($_GET['operator'], $_GET['hp'], $_GET['character_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['update'] === 'inventory'){
            //request parameters = character_id(=int), object_id(=int), qty(=int)
            $updateInventory = new InventoryController();
            echo json_encode($updateInventory->updateObjectInventory($_GET['character_id'], $_GET['operator'], $_GET['object_id'], $_GET['qty']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['update'] === 'character'){
            if(isset($_GET['col'])){
                //request parameters = col(=string), value(=string OR =int), id(=int)
                $updateCharacter = new CharacterController();
                $updateCharacter->updateOne($_GET['col'], $_GET['value'], $_GET['id']);
                $response = "Caractéristique du personnage mise à jour.";
                echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }

        if($_GET['update'] === "equipment"){
            if(isset($_GET['weapon_id'])){
                $updateEquipment = new EquipmentController();
                echo json_encode($updateEquipment->updateWeapon($_GET['character_id'], $_GET['weapon_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            if(isset($_GET['armor_id'])){
                $updateEquipment = new EquipmentController();
                echo json_encode($updateEquipment->updateArmor($_GET['character_id'], $_GET['armor_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }

    }

    //INDEX
    if(isset($_GET['index'])){

        if($_GET['index'] === 'characters'){
            if(!isset($_GET['class'])){
                $indexCharacter = new CharacterController();
                echo json_encode($indexCharacter->index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }

            if(isset($_GET['class'])){
                //request parameters = class(=string)
                $indexCharacter = new CharacterController();
                echo json_encode($indexCharacter->indexByClass($_GET['class']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }

        if($_GET['index'] === 'classes') {
            $indexClasses = new ClassController();
            echo json_encode($indexClasses->index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['index'] === 'inventories') {
            $indexInventories = new InventoryController();
            echo json_encode($indexInventories->index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['index'] === 'inventory'){
            //request parameters = character_id(=int)
            $indexInventory = new InventoryController();
            echo json_encode($indexInventory->find($_GET['character_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['index'] === 'objects'){
            if(!isset($_GET['type'])){
                $indexObjects =new ObjectController();
                echo json_encode($indexObjects->index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            if(isset($_GET['type'])){
                //request parameters = type(=string)
                $indexObjects =new ObjectController();
                echo json_encode($indexObjects->indexByType($_GET['type']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }

        if($_GET['index'] === 'events'){
            $indexEvents = new EventController();
            echo json_encode($indexEvents->index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

    }

    //FIND
    if(isset($_GET['find'])){

        if($_GET['find'] === 'object'){
            $findObject = new ObjectController();
            echo json_encode($findObject->findById($_GET['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['find'] === 'session'){
            echo json_encode($_SESSION, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            //echo json_encode($connected, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['find'] === 'class'){
            //request parameters = col(=string), value(=string)
            $findClass = new ClassController();
            echo json_encode($findClass->find($_GET['col'], $_GET['value']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['find'] === 'inventory'){
            $findInventory = new InventoryController();
            if(isset($_GET['object_id'])){
                echo json_encode($findInventory->findObject($_GET['character_id'], $_GET['object_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            } else {
                //request parameters = character_id(=int)
                echo json_encode($findInventory->find($_GET['character_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        }

        if($_GET['find'] === 'character'){
            //request parameters = id(=int)
            //return a JSON in 2 parts : character with all character's info / inventory with all the objects on the character in
            $findCharacter = new CharacterController();
            echo json_encode($findCharacter->findWithInventory($_GET['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['find'] === 'equipment'){
            $findEquipment = new EquipmentController();
            echo json_encode($findEquipment->find($_GET['character_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if($_GET['find'] === 'user'){
            $findUser = new UserController();
            echo json_encode($findUser->find($_GET['username'], $_GET['password']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    }

    if(isset($_GET['roll_dice'])){
        $roll_dice = new EventController();
        echo json_encode($roll_dice->rollDice($_GET['roll_dice']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    if(isset($_GET['logout'])){
        $logout = new UserController();
        echo json_encode($logout->logout(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

}
else
{
    //echo json_encode("access denied", JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}




