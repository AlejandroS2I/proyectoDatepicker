var citas = {};
var configDatepicker = {
        inline: true, // Muestra el widget de forma "inline"
        minDate: 0, // Define la fecha mínima a hoy, deshabilitando todas las anteriores
        // Se ejecuta cuando el usuario selecciona una fecha y nos la proporciona
        onSelect: function(fecha) {
                // Escondemos los formularios
                $('#formReservar').hide();
                $('#formBorrar').hide();

                // Tratamos la fecha
                fecha = fecha.split("/");
                fecha = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
                let objetoFecha = new Date(fecha + 'T00:00:00');

                // Si esta fecha está contenida en las ya reservadas muestra su información
                // en caso contrario muestra el formulario para reservarla
                if ( citas[objetoFecha] ) {
                        mostrarCita(citas[objetoFecha]);
                } else {
                        mostrarReservar(fecha);
                }
        },
        // Se ejecuta antes de mostrar cada día y nos proporciona este
        beforeShowDay: function(date) {
                // Tenemos que devolver un array con la siguiente estructura: [habilitado, clases, título]
                // Si se encuentra en las reservadas le añadimos la clase "cogida"
                if ( citas[date] ) {
                        return [true, 'cogida', ''];
                }
                // En caso contrario no hacemos nada
                return [true, '', ''];
        }
}

$(document).ready(() => {
        // Escondemos ambos formularios
        $('#formReservar').hide();
        $('#formBorrar').hide();

        // Seleccionamos las citas
        seleccionarCitas()
                .then(function(res) {
                        // Las resaltamos
                        resaltarCitas(res);
                        // Inicializamos el datepicker
                        $('#datepicker')
                                .datepicker( 
                                        // Definimos su configuración
                                        configDatepicker,
                                        // Definimos el idioma del widget
                                        $.datepicker.regional["es"]
                                );
                });
});

// Función para insertar una cita en la BBDD
function insertCita(cliente, descripcion, fecha) {
	return $.ajax({
		type: 'POST',
		url: 'php/insertCita.php',
		data: {
			Cliente: cliente,
			Descripcion: descripcion,
			Fecha: fecha
		},
		error: function(e) {
			console.error(e);
		}
	});
}

// Función para actualizar una cita de la BBDD
function actualizarCida(id, cliente, descripcion, fecha) {
    return $.ajax({
        type: 'POST',
        url: 'php/updateCita.php',
        data:{
            ID: id,
            Cliente: cliente,
            Descripcion: descripcion,
            Fecha: fecha,
        },
        error: function (e) {
            console.error(e);
        }
    })
}

// Función para eliminar una cita de la BBDD
function eliminarCita(id) {
	return $.ajax({
		type: 'POST',
		url: 'php/deleteCita.php',
		data: {
			ID: id,
		},
		error: function(e) {
			console.error(e);
		}
	});
}

// Función para eliminar una cita a partir de su fecha de la BBDD
function eliminarCitaPorFecha(fecha) {
	return $.ajax({
		type: 'POST',
		url: 'php/deleteCitaByFecha.php',
		data: {
			Fecha: fecha,
		},
		error: function(e) {
			console.error(e);
		}
	});
}

// Función para seleccionar las citas existentes en la BBDD
function seleccionarCitas() {
        return $.ajax({
        type: 'GET',
        url: 'php/selectCitas.php',
        dataType: 'json',
        error: function (e) {
                console.error(e);
        }
    });
}

// Función para resaltar las citas recibidas por la BBDD
function resaltarCitas(_citas){
        // Vaciamos las citas anteriores
        citas = [];
        // Iteramos por toda la lista que nos ha devuelto el servidor
        _citas.forEach((cita) => {
                citas[ new Date(cita.Fecha + 'T00:00:00') ] = cita;
        });
}

// Función para reservar una cita
function reservarCita(cliente, descripcion, fecha) {
        // Insertamos la cita en la BBDD
        insertCita(cliente, descripcion, fecha)
                .then(function () {
                        // Seleccionamos las citas
                        seleccionarCitas()
                                .then(function (res) {
                                        // Resaltamos las citas
                                        resaltarCitas(res);
                                        // Refrescamos el widget
                                        $('#datepicker').datepicker('refresh');
                                });
                });
}

// Función para reservar una cita
function liberarCita(fecha) {
        // Insertamos la cita en la BBDD
        eliminarCitaPorFecha(fecha)
                .then(function () {
                        // Seleccionamos las citas
                        seleccionarCitas()
                                .then(function (res) {
                                        // Resaltamos las citas
                                        resaltarCitas(res);
                                        // Refrescamos el widget
                                        $('#datepicker').datepicker('refresh');
                                });
                });
}

// Función para mostrar la reserva
function mostrarReservar(fecha) {
        // Mostramos el formulario
        $('#formReservar').show();

        // Controlamos la reserva
        $('#formReservar').on('submit', function(e) {
                // Prevenimos la acción por defecto
                e.preventDefault();

                // Si este pasa la validación
                if (validarReserva()) {
                        // Reservamos la cita
                        reservarCita($('#cliente').val(), $('#descripcion').val(), fecha);

                        // Limpiamos los campos
                        $('#formReservar').trigger('reset');
                        // Eliminamos este control
                        $('#formReservar').off('submit');
                        // Escondemos el formulario
                        $('#formReservar').hide();
                }
        });
}

// Función para mostrar la cita
function mostrarCita(cita) {
        // Poblamos los campos
        $('#formBorrar').children('h3')[0].innerText = cita.Cliente;
        $('#formBorrar').children('p')[0].innerText = cita.Descripcion;

        // Mostramos el formulario
        $('#formBorrar').show();

        // Controlamos el borrar
        $('#formBorrar').on('submit', function(e) {
                // Prevenimos la acción por defecto
                e.preventDefault();

                // Liberamos la cita
                liberarCita(cita.Fecha);

                // Borramos este control
                $('#formBorrar').off('submit');
                // Escondemos el formulario
                $('#formBorrar').hide();
        });
}

// Función para validar la reserva
function validarReserva() {
        // Inicializamos las variables necesarias
        let bandera = true;
        let errores = $('#errores');

        // Limpiamos los errores
        errores.empty();

        // Cliente
        if ($('#cliente').val() == "") {
                bandera = false;
                errores.append(
                        $('<p>')
                                .addClass('error')
                                .text('No se ha proporcionado un cliente')
                );
        }

        // Descripción
        if ($('#descripcion').val() == "") {
                bandera = false;
                errores.append(
                        $('<p>')
                                .addClass('error')
                                .text('No se ha proporcionado una descripción')
                );
        }

        return bandera;
}
