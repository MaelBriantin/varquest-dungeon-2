<?php

include_once dirname(__DIR__).'/controllers/CharacterController.php';
include_once dirname(__DIR__).'/controllers/ObjectController.php';

if (isset($_POST) and $_POST != [] AND !isset($_POST['delete_character'])) {

    $newCharacter = new CharacterController();
    $newCharacter->createNewCharacter($_POST['name'], $_POST['class']);

}

if (isset($_POST['delete_character'])) {

    $deleteCharacter = new CharacterController();
    $deleteCharacter->delete($_POST['delete_character']);

}

$getCharacters = new CharacterController();
$characters = $getCharacters->index();

$getClasses = new ClassController();
$classes = $getClasses->index();

?>

<form action="" method="POST" class="form">
    <label>Name:</label>
    <input type="text" name="name">

    <label>Class:</label>
    <select name="class">
        <option disabled selected value>--Select a class--</option>
        <?php
            foreach ($classes as $class){
                echo "<option>".$class['name']."</option>";
            }
        ?>
    </select>

    <button type="submit">Create Character</button>
</form>

<table class="characterTable">
    <thead>
        <tr>
            <td class="header">NAME</td>
            <td class="header">CLASS</td>
            <td class="header">HP</td>
            <td class="header">STRENGTH</td>
            <td class="header">DEXTERITY</td>
            <td class="header">INTELLIGENCE</td>
            <td class="header">DELETE</td>
        </tr>
    </thead>
    <tbody>
    <?php
        foreach ($characters as $character) {
            echo "<tr>";
            echo "<td class='col'>".$character['name']."</td>";
            echo "<td class='col'>".$character['class']."</td>";
            echo "<td class='col'>".$character['current_hp']."/".$character['max_hp']."</td>";
            echo "<td class='col'>".$character['str']."</td>";
            echo "<td class='col'>".$character['dex']."</td>";
            echo "<td class='col'>".$character['intel']."</td>";
            echo "<td class='col'><form action='' method='POST'><input type='hidden' name='delete_character' value='".$character['id']."'><button class='deleteBtn' type='submit'>Delete Character</button></form></td>";
            echo "</tr>";
        }
    ?>
    </tbody>
</table>

<style>
    .spacer{
        width: 50px;
    }
    .form{
        margin: 20px 0px 0px 20px;
    }
    .characterTable{
        border: black 2px solid;
        width: 50%;
        margin: 20px 0px 0px 20px;
    }
    .col{
        font-size: 18px;
        padding-left: 10px;
        border: black 1px solid;
    }
    .deleteBtn{
        margin-top: 10px;
    }
    .header{
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        color: white;
        background: gray;
    }
</style>


