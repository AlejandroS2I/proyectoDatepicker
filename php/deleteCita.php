<?php
if (isset($_POST['id'])) {
    require_once 'connect.php';
    $db = 'Citas';

    $conexion = conectar($db);
    $parametros = array(":ID" => $_POST['ID']);
    $sql = "DELETE FROM TCitas WHERE ID = :ID";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
}
?>
