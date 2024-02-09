var citas = {};

$(document).ready(() => {
        // Inicializamos el datepicker
        $('#formReservar').hide();
        $('#formBorrar').hide();
        seleccionarCitas()
                .then(function(res) {
                        resaltarCitas(res);
                        $('#datepicker')
                                .datepicker( 
                                        {
                                                inline: true,
                                                showOtherMonths: true,
                                                onSelect: function(fecha) {
                                                        _fecha = new Date(fecha);
                                                        $('#formReservar').hide();
                                                        $('#formBorrar').hide();
                                                        if ( citas[_fecha] ) {
                                                                $('#formBorrar').show();
                                                                $('#formBorrar').on('submit', function(e) {
                                                                        e.preventDefault();
                                                                        // Hacer validacion
                                                                        fecha = fecha.split("/");
                                                                        liberarCita(`${fecha[2]}-${fecha[1]}-${fecha[0]}`);
                                                                        $('#formBorrar').off('submit');
                                                                        $('#formBorrar').hide();
                                                                });
                                                        } else {
                                                                $('#formReservar').show();
                                                                $('#formReservar').on('submit', function(e) {
                                                                        e.preventDefault();
                                                                        // Hacer validacion
                                                                        fecha = fecha.split("/");
                                                                        reservarCita($('#cliente').val(), $('#descripcion').val(), `${fecha[2]}-${fecha[1]}-${fecha[0]}`);
                                                                        $('#formReservar').trigger('reset');
                                                                        $('#formReservar').off('submit');
                                                                        $('#formReservar').hide();
                                                                });
                                                        }
                                                },
                                                beforeShowDay: function(date) {
                                                        if ( citas[date] ) {
                                                                return [true, 'cogida', ''];
                                                        }
                                                        return [true, '', ''];
                                                }
                                        },
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
        // Iteramos por toda la lista que nos ha devuelto el servidor
        _citas.forEach((cita) => {
                citas[ new Date(cita.Fecha + 'T00:00:00') ] = new Date(cita.Fecha + 'T00:00:00').toString();
        });
}

// Función para reservar una cita
function reservarCita(cliente, descripcion, fecha) {
        // Insertamos la cita en la BBDD
        insertCita(cliente, descripcion, fecha)
                .then(function () {
                        // Refrescamos el widget
                        seleccionarCitas()
                                .then(function (res) {
                                        resaltarCitas(res);
                                        $('#datepicker').datepicker('refresh');
                                });
                });
}

// Función para reservar una cita
function liberarCita(fecha) {
        // Insertamos la cita en la BBDD
        eliminarCitaPorFecha(fecha)
                .then(function () {
                        // Refrescamos el widget
                        seleccionarCitas()
                                .then(function (res) {
                                        resaltarCitas(res);
                                        $('#datepicker').datepicker('refresh');
                                });
                });
}

