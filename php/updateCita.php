<?php
        require_once 'connect.php';
        $db = 'Citas';

        $conexion = conectar($db);
        $parametros = array(
            ":ID" => $_POST['ID'],
            ":Cliente"=>$_POST['Cliente'],
            ":Descripcion"=>$_POST['Descripcion'],
            ":Hecha"=>$_POST['Hecha'],
        );
        $sql = "UPDATE TCitas SET Cliente = :Cliente, Descripcion = :Descripcion, Fecha = :Fecha WHERE ID = :ID";
        $pdo = $conexion->prepare($sql);
        $pdo->execute($parametros);
    
?>
