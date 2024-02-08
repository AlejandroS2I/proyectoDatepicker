<?php
        require_once 'connect.php';
        $db = 'tareas';

        $conexion = conectar($db);
        $parametros = array(
            ":id" => $_POST['id'],
            ":titulo"=>$_POST['titulo'],
            ":descripcion"=>$_POST['descripcion'],
            ":hecha"=>$_POST['hecha'],
        );
        $sql = "UPDATE ttareas SET titulo = :titulo, descripcion = :descripcion, hecha = :hecha WHERE id = :id";
        $pdo = $conexion->prepare($sql);
        $pdo->execute($parametros);
    
?>
