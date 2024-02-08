<?php
    require_once 'connect.php';
    $db = 'Tareas';
    $conexion = conectar($db);
    $sql = "SELECT * FROM TTareas";
    $pdo = $conexion->prepare($sql);
    $pdo->execute();

    $datos = $pdo->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($datos);
?>
