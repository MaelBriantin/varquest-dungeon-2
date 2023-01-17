<?php

include_once dirname(__DIR__)."/controllers/ClassController.php";

if (isset($_POST) AND $_POST != [] AND !isset($_POST['delete'])) {
    $createClass = new ClassController();
    $createClass->create($_POST);
}

if (isset($_POST['deleteBtn'])) {
    $deleteClass = new ClassController();
    $deleteClass->delete($_POST['delete']);
}

$getClasses = new ClassController();
$classes = $getClasses->index();

?>

<form action="" method="POST" class="form">
    <label>Name</label>
    <input type="text" name="name">
    <label>Type</label>
    <select name="type">
        <option disabled selected value>--Select type of class--</option>
        <option>Magie</option>
        <option>Corps à corps</option>
    </select>
    <label>Excerpt</label>
    <input style="width: 300px" type="text" name="excerpt">
    <label>HP</label>
    <input style="width: 60px" type="number" name="hp">
    <label>Dexterity</label>
    <input style="width: 60px" type="number" name="dex">
    <label>Strength</label>
    <input style="width: 60px" type="number" name="str">
    <label>Intelligence</label>
    <input style="width: 60px" type="number" name="intel">
    <button type="submit">Create Class</button>
</form>

<table class="characterTable">
    <thead>
    <tr>
        <td class="header">NAME</td>
        <td class="header">TYPE</td>
        <td class="header">EXCERPT</td>
        <td class="header">HP</td>
        <td class="header">STRENGTH</td>
        <td class="header">DEXTERITY</td>
        <td class="header">INTELLIGENCE</td>
        <td class="header">DELETE</td>
    </tr>
    </thead>
    <tbody>
    <?php
    foreach ($classes as $class) {
        echo "<tr>";
        echo "<td class='col'>".$class['name']."</td>";
        echo "<td class='col'>".$class['type']."</td>";
        echo "<td class='col'>".$class['excerpt']."</td>";
        echo "<td class='col'>".$class['hp']."</td>";
        echo "<td class='col'>".$class['str']."</td>";
        echo "<td class='col'>".$class['dex']."</td>";
        echo "<td class='col'>".$class['intel']."</td>";
        echo "<td class='col'><form action='' method='POST' ><input type='hidden' name='delete_character' value='".$class['id']."'><button class='deleteBtn' type='submit'>Delete Class</button></form></td>";
        echo "</tr>";
    }
    ?>
    </tbody>
</table>


<style>
    <style>
    .spacer{
        width: 50px;
    }
    .form{
        margin: 20px 0px 0px 20px;
    }
    .objectTable{
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
        margin-top: 15px;
    }
    .header{
        min-width: 150px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        color: white;
        background: gray;
    }
</style>
</style>


