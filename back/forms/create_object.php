<?php
    include_once './back/controllers/ObjectController.php';
    include_once './back/controllers/ClassController.php';

    if(isset($_POST) AND $_POST != []){
        if(isset($_POST['delete_object'])) {
            $deleteObject = new ObjectController();
            $deleteObject->delete($_POST['delete_object']);
        }
        if(!isset($_POST['delete_object'])){
            $properties = "[".'"'.$_POST['props_stat'].'","'.$_POST['props_effect'].'",'.$_POST['props_number']."]";

            $values = [
                'name' => $_POST['name'],
                'type' => $_POST['type'],
                'type' => $_POST['class'],
                'description' => $_POST['description'],
                'properties' => $properties,
                'genre' => $_POST['genre']
            ];

            $createObject = new ObjectController();
            $createObject->create($values);
        }
    }

    $indexObjects = new ObjectController();
    $objects = $indexObjects->index();

    $indexClasses = new ClassController();
    $classes = $indexClasses->index();

?>

<form action="" method="POST" class="form">
    <label>Genre</label>
    <select name="genre">
        <option>Un</option>
        <option>Une</option>
    </select>

    <label>Name</label>
    <input type="text" name="name">

    <label>Type</label>
    <select name="type">
        <option disabled selected value>--Select an option--</option>
        <option>Armure</option>
        <option>Arme</option>
        <option>Consommable</option>
    </select>

    <label>Class</label>
    <select name="class">
        <option disabled selected value>--Select a type of class--</option>
        <option>Toutes</option>
        <option>Magie</option>
        <option>Corps à corps</option>
    </select>

    <label>Description</label>
    <input type="text" name="description">

    <label>Properties</label>
    <select name="props_stat">
        <option disabled selected value>Stat</option>
        <option value="max_hp">PV max</option>
        <option value="current_hp">PV actuel</option>
        <option value="str">Str</option>
        <option value="dex">Dex</option>
        <option value="intel">Intel</option>
    </select>
    <select name="props_effect">
        <option disabled selected value>Effect</option>
        <option value="+">+</option>
        <option value="-">-</option>
        <option value="x">x</option>
        <option value="/">/</option>
    </select>
    <input type="number" name="props_number">


    <button type="submit">Create Object</button>
</form>

<table class="objectTable">
    <thead>
    <tr>
        <td class="header">NAME</td>
        <td class="header">TYPE</td>
        <td class="header">CLASS</td>
        <td class="header">DESCRIPTION</td>
        <td class="header">PROPERTIES</td>
        <td class="header">DELETE</td>
    </tr>
    </thead>
    <tbody>
    <?php
    foreach ($objects as $object) {
        echo "<tr>";
        echo "<td class='col'>".$object['name']."</td>";
        echo "<td class='col'>".$object['type']."</td>";
        echo "<td class='col'>".$object['class']."</td>";
        echo "<td class='col'>".$object['description']."</td>";
        echo "<td class='col'>".$object['properties']."</td>";
        echo "<td class='col'><form action='' method='POST'><input type='hidden' name='delete_object' value='".$object['id']."'><button class='deleteBtn' type='submit'>Delete Object</button></form></td>";
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
