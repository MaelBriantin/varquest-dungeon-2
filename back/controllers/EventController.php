<?php

require_once 'Controller.php';
require_once 'ObjectController.php';
require_once 'CharacterController.php';

class EventController extends Controller
{
    private string $table;
    function __construct()
    {
        $this->table = 'events';
    }

    public function createNewEvent ($qty = null)
    {
        if(isset($qty)){
            if($qty === "random"){
                $n = rand(2, 4);
                $events = [];
                for ($i=0;$i<$n;$i++){
                    $events[] = $this->setRandom('event');
                }
                return $events;
            }
            else if($qty == 1){
                return $this->setRandom('event');
            }
            else if($qty > 1){
                $events = [];
                for($i=0;$i<$qty;$i++){
                    $events[] = $this->setRandom('event');
                }
                return $events;
            }
            else {
                return "Bah alors... On s'est trompé quelque part ?";
            }
        } else {
            return $this->setRandom('event');
        }
    }

    public function createNewEventByType ($type) {
        $object = new ObjectController();
        $event = new stdClass();
        $enemy = new CharacterController();
        switch ($type){
            case 'Rencontre':
                $event = new stdClass();
                $event->typeOfEvent = 'Rencontre';
                $event->script = $this->findNameLikeRandom('stranger');
                $objectArr = [];
                $objectArr[] = $object->randomSelect($this->setRandom('object'), 1);
                $objectArr[] = $object->randomSelect($this->setRandom('object'), 1);
                $event->object = $objectArr;
                return $event;
            case 'Combat':
                $event = new stdClass();
                $event->typeOfEvent = 'Combat';
                $event->script = $this->findNameLikeRandom('fight');
                $event->enemy = $enemy->find('name', $this->setRandom('enemy'));
                $event->dice = $this->rollDice(20);
                return $event;
                break;
            case 'Coffre':
                $event = new stdClass();
                $event->typeOfEvent = 'Coffre';
                $event->script = $this->findNameLikeRandom('chest');
                $event->object = $object->randomSelect($this->setRandom('object'), 1);
                return $event;
                break;
            case 'Piège':
                $event = new stdClass();
                $event->typeOfEvent = 'Piège';
                $event->damage = $this->rollDice(5);
                $event->dice = $this->rollDice(20);
                $event->script = $this->findNameLikeRandom('trap');
                return $event;
                break;
        }
    }

    public function delete ()
    {

    }

    public function update ()
    {

    }

    public function index ()
    {
        $sql = "SELECT * FROM $this->table";
        return $this->getAllData($sql);
    }

    public function findNameLikeRandom ($name)
    {
        $sql = "SELECT name, type, script1, script2, script3 FROM $this->table WHERE name LIKE '%".$name."%' ORDER BY RAND() LIMIT 1";
        return $this->getData($sql);
    }

    public function find ($col, $value)
    {
        if($col === 'name' OR $col === 'type'){
            $value = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            $value = $value;
        }
        $sql = "SELECT name, type, script1, script2, script3 FROM $this->table WHERE $col = $value";
        return $this->getData($sql);
    }

    public function selectRandom ($type, $qty)
    {
        $sql = "SELECT * FROM $this->table WHERE type = $type ORDER BY RAND() LIMIT $qty";
        $qty === 1 ? $result = $this->postData($sql) : $result = $this->getAllData($sql);
        return $result;
    }

    public function rollDice ($dice)
    {
        return rand(1, $dice);
    }

    //other functions
    private function setRandom ($type)
    {
        if ($type === 'enemy'){
            $n = rand(1, 20);
            $goblin = range(1, 10);
            $orc = range(11, 14);
            $troll = range(15, 17);
            $wizard = range(18, 19);
            $red_dragon = 20;
            switch ($n){
                case in_array($n, $goblin):
                    return 'Gobelin';
                    break;
                case in_array($n, $orc):
                    return 'Orc';
                    break;
                case in_array($n, $troll):
                    return 'Troll';
                    break;
                case in_array($n, $wizard):
                    return 'Sorcier';
                    break;
                case $red_dragon:
                    return 'Dragon Rouge';
                    break;
            }
        }
        if ($type === 'object'){
            $n = rand(1, 10);
            $potion = range(1, 6);
            $weapon = range(7, 8);
            $armor = range(9, 10);
            switch ($n){
                case in_array($n, $potion):
                    return 'Consommable';
                case in_array($n, $weapon):
                    return 'Arme';
                case in_array($n, $armor):
                    return 'Armure';
            }
        }
        if ($type === 'event'){
            $enemy = new CharacterController();
            $object = new ObjectController();
            $event = new stdClass();
            $n = rand(1, 20);
            $fight = range(1, 7);
            $chest = range(8, 14);
            $trap = range(15, 19);
            $stranger = 20;
            switch ($n){
                case $stranger:
                    $event->typeOfEvent = 'Rencontre';
                    $event->script = $this->findNameLikeRandom('stranger');
                    $objectArr = [];
                    $objectArr[] = $object->randomSelect($this->setRandom('object'), 1);
                    $objectArr[] = $object->randomSelect($this->setRandom('object'), 1);
                    $event->object = $objectArr;
                    return $event;
                case in_array($n, $fight):
                    $event->typeOfEvent = 'Combat';
                    $event->script = $this->findNameLikeRandom('fight');
                    $event->enemy = $enemy->find('name', $this->setRandom('enemy'));
                    $event->dice = $this->rollDice(20);
                    return $event;
                    break;
                case in_array($n, $chest):
                    $event->typeOfEvent = 'Coffre';
                    $event->script = $this->findNameLikeRandom('chest');
                    $event->object = $object->randomSelect($this->setRandom('object'), 1);
                    return $event;
                    break;
                case in_array($n, $trap):
                    $event->typeOfEvent = 'Piège';
                    $event->damage = $this->rollDice(5);
                    $event->dice = $this->rollDice(20);
                    $event->script = $this->findNameLikeRandom('trap');
                    return $event;
                    break;
            }
        }
    }
}
