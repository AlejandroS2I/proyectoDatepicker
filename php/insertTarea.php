<?php
    require_once 'connect.php';
    $db = 'tareas';

    $conexion = conectar($db);
    $parametros = array(
        ":Titulo"=>$_POST['Titulo'],
        ":Descripcion"=>$_POST['Descripcion'],
        ":Hecha"=>$_POST['Hecha']
    );
    $sql = "INSERT INTO `ttareas` ( `Titulo`, `Descripcion`, `Hecha`) VALUES (:Titulo, :Descripcion, :Hecha)";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
?>