<?php
if (isset($_POST['Fecha'])) {
    require_once 'connect.php';
    $db = 'Citas';

    $conexion = conectar($db);
    $parametros = array(":Fecha" => $_POST['Fecha']);
    $sql = "DELETE FROM TCitas WHERE Fecha = :Fecha";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
}
?>
