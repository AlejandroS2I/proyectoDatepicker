var citas = {};

citas[ new Date( '02/02/2024' )] = new Date( '02/02/2024' ).toString();

$(document).ready(() => {
        seleccionarCitas()
                .then(function(res) {
                        resaltarCitas(res);
                        $('#datepicker')
                                .datepicker( 
                                        {
                                                inline: true,
                                                showOtherMonths: true,
                                                onSelect: function(texto) {
                                                        console.log(texto);
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
                let _fecha = new Date(cita.Fecha);
                citas[ new Date(_fecha.getMonth + '/' + _fecha.getDay + '/' + _fecha.getFullYear) ] = new Date(cita.Fecha).toString();
        });
}

