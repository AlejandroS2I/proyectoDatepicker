<?php
if (isset($_POST['id'])) {
    require_once 'connect.php';
    $db = 'tareas';

    $conexion = conectar($db);
    $parametros = array(":id" => $_POST['id']);
    $sql = "DELETE FROM ttareas WHERE ID = :id";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
}
?>
