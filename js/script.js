var citas = {};

citas[ new Date( '02/02/2024' )] = new Date( '02/02/2024' ).toString();

$(document).ready(() => {
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
                                                return [false, 'cogida', ''];
                                        }
                                        return [true, '', ''];
                                }
                        },
                        $.datepicker.regional["es"]
                );
});
