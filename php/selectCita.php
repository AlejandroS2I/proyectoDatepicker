<?php
    require_once 'connect.php';
    $db = 'Citas';
    $conexion = conectar($db);
    $sql = "SELECT * FROM TCitas";
    $pdo = $conexion->prepare($sql);
    $pdo->execute();

    $datos = $pdo->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($datos);
?>
