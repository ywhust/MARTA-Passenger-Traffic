$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = parseFloat( $('#min').val());
        var max = parseFloat( $('#max').val());
        var value = parseFloat( data[1] ) || 0; // use data for the value column
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && value <= max ) ||
             ( min <= value   && isNaN( max ) ) ||
             ( min <= value   && value <= max ) )
        {
            return true;
        }
        return false;
    }
);
 
$(document).ready(function() {
    //create with custom dom without the orginal search filter 
    var table = $('#breezecards').DataTable( {
        "dom": '<l<t>ip>'
    });
     
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );

    $('#owner').on( 'keyup', function () {
        table.column( [2,0] ).search( this.value ).draw();
    } );

    $('#cnum').on( 'keyup', function () {
        table.column( [0,0] ).search( this.value ).draw();
    } );

    //regex search for !Michael - set regex to true
    $('#suspendedCards').on( 'click', function () {
        if (document.getElementById("checkbox").checked == false)
        table.search( "^((?!Michael).)*$", true ).draw();
        else table.search("").draw();
    } );
} );