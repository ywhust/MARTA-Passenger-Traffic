$(document).ready(function () {
    getStations();

    $('#view-station-btn').prop('disabled', true);

    var selectedID;
    $('#stations tbody').on('click', 'tr', function() {
        selectedID = $datatable.row(this).data()[1];
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#view-station-btn').prop('disabled', true);
        } else {
            $datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#view-station-btn').prop('disabled', false);
        }
    });

    $('#view-station-btn').on('click', () => {
        window.location.href='/viewStation.html?id=' + selectedID;
    });

    $('#create-station-btn').on('click', () => {
        window.location.href='/newStation.html';
    });

});

var $datatable = $('#stations').DataTable();

var getStations = function() {
    var port = 3000;
    var username = 'admin';

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `http://localhost:${port}/stationsListing`,

        success: function (data) {
            $datatable.clear();

            var json = JSON.parse(data);

            var array;
            for (var i = 0; i < json.length; i++) {
                array = [];
                array.push(json[i].Name);
                array.push(json[i].StopID);
                array.push('$' + json[i].EnterFare.toFixed(2));
                if (json[i].ClosedStatus === 1) {
                    array.push('Closed');
                } else {
                    array.push('Open');
                }
                $datatable.row.add(array);
            }
            $datatable.draw();
        }
    });
}