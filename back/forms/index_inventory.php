<?php

require_once 'controllers/InventoryController.php';

$inventoryIndex = new InventoryController();
$inventories = $inventoryIndex->index();


?>

<table class="inventoryTable">
    <thead>
    <tr>
        <td class="header">CHARACTER</td>
        <td class="header">OBJECT NAME</td>
        <td class="header">OBJECT TYPE</td>
        <td class="header">OBJECT DESCRIPTION</td>
        <td class="header">OBJECT PROPERTIES</td>
        <td class="header">QUANTITY</td>
    </tr>
    </thead>
    <tbody>
    <?php
    foreach ($inventories as $row) {
        echo "<tr>";
        echo "<td class='col'>".$row['character_name']."</td>";
        echo "<td class='col'>".$row['object_name']."</td>";
        echo "<td class='col'>".$row['object_type']."</td>";
        echo "<td class='col'>".$row['object_description']."</td>";
        echo "<td class='col'>".$row['object_properties']."</td>";
        echo "<td class='col'>".$row['quantity']."</td>";
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
    .inventoryTable{
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

