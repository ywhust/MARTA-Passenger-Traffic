var username = String(window.location.search.split('?')[1].split('=')[1]);

$(document).ready(function () {

    // hide error messages
    $('#wrong-card-num').hide();
    $('#wrong-credit-num').hide();
    $('#wrong-value').hide();
    $('#limitation').hide();
    $('#wrong-rm-msg').hide();

    // init data table
    getBreezecards();

    var selectedCard;
    var selectedValue;

    $('#home').on('click', () => {
        window.location.href = '/passengerBreezecards.html?username=' + username;
    })

    $('#breezecards tbody').on('click', 'tr', function() {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#add-value-btn').prop('disabled', true);
        } else {
            $datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#add-value-btn').prop('disabled', false);
        }
    });

    $('#breezecards tbody').on('click', 'td', function() {
        selectedCard = $datatable.row(this).data()[0];
        selectedValue = ($datatable.row(this).data()[1]).split('$')[1];
        if ($datatable.cell(this).data() == 'Remove') {
            // if only one card, stop the remove operation
            if ($datatable.rows().count() <= 1) {
                $('#wrong-rm-msg').show();
            } else {
                removeBreezecard(selectedCard);
            }
        }
    });

    $('#add-new-card-btn').on('click', function() {
        var breezecardNum = $('#new-card-num').val();
        if (breezecardNum.length != 16) {
            $('#wrong-card-num').show();
        } else {
            addBreezecard(breezecardNum);
            $('#wrong-card-num').hide();
        }
    });

    $('#add-value-btn').on('click', function() {
        $('#wrong-credit-num').hide();
        $('#wrong-value').hide();
        $('#limitation').hide();
        var value = Number($('#value').val());
        var card_num = $('#credit-card').val();
        if (card_num.length != 16) {
            $('#wrong-credit-num').show();
        }
        if (value < 0) {
            console.log("wrong value")
            $('#wrong-value').show();
        }
        if (value + Number(selectedValue) > 1000) {
            console.log(Number(selectedValue));
            $('#limitation').show();
        }

        var isValid = card_num.length == 16 && value >= 0 &&  value + Number(selectedValue) <= 1000
        if (isValid) {
            $('#wrong-value').hide();
            $('#limitation').hide();
            $('#wrong-credit-num').hide();
            // update balance in database
            console.log(selectedCard);
            addValueBreezecard(selectedCard, value);
            $('#add-value-btn').prop('disabled', true);
        }
    });
});

var $datatable = $('#breezecards').DataTable();
var port = 3000;
// var belongsTo = 'adinozzo';
var belongsTo = String(window.location.search.split('?')[1].split('=')[1]);
console.log(belongsTo);

var createDataTable = function(data) {
    $datatable.clear();
    var json = JSON.parse(data);
    // add one row at a time
    var array;
    for (var i = 0; i < json.length; i++) {
        array = [];
        array.push(json[i].BreezecardNum);
        array.push('$' + json[i].Value.toFixed(2));
        array.push('Remove');
        $datatable.row.add(array);
    }
    $datatable.draw();
}

var addValueBreezecard = function(breezecardNum, value) {
    var url = `http://localhost:${port}/addValueBreezecard`;
    var data = {
        'belongsTo': belongsTo,
        'breezecardNum': breezecardNum,
        'value': value
    };
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(result) {
            createDataTable(result);
        }
    });
}

var addBreezecard = function(breezecardNum) {
    var url = `http://localhost:${port}/addBreezecard`;
    var data = {
        'belongsTo': belongsTo,
        'breezecardNum': breezecardNum
    };
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(result) {
            if (result.message != undefined) {
                alert(result.message);
            } else {
                createDataTable(result);
            }
            // createDataTable(result);
        }
    });
}

var removeBreezecard = function(breezecardNum) {
    var url = `http://localhost:${port}/removeBreezecard`;
    var data = {
        'belongsTo': belongsTo,
        'breezecardNum': breezecardNum
    };
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(result) {
            console.log(result)
            if (result.message != undefined) {
                alert(result.message);
            } else {
                createDataTable(result);
            }
        }
    });
}

var getBreezecards = function() {
    var url = `http://localhost:${port}/getBreezecards?belongsTo=${belongsTo}`;

    // var $datatable = $('#breezecards').DataTable();
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url,
        success: function(data) {
            createDataTable(data);
        }
    });
}
