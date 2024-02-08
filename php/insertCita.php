<?php
    require_once 'connect.php';
    $db = 'Citas';

    $conexion = conectar($db);
    $parametros = array(
        ":Cliente"=>$_POST['Cliente'],
        ":Descripcion"=>$_POST['Descripcion'],
        ":Fecha"=>$_POST['Fecha']
    );
    $sql = "INSERT INTO `TCitas` ( `Cliente`, `Descripcion`, `Fecha`) VALUES (:Cliente, :Descripcion, :Fecha)";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
?>
