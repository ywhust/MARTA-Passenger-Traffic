$(document).ready(function () {

    initSuspendedCardsTable();

    var breezecard_num;
    var new_owner;
    var old_owner

    $('#cards tbody').on('click', 'tr', function() {
        breezecard_num = $datatable.row(this).data()[0];
        new_owner = $datatable.row(this).data()[1];
        old_owner = $datatable.row(this).data()[3];
        if ($(this).hasClass('selected')) {
            // console.log('row has been selected');
            $(this).removeClass('selected');
            $('#to-new-btn').prop('disabled', true);
            $('#to-old-btn').prop('disabled', true);
        } else {
            $datatable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#to-new-btn').prop('disabled', false);
            $('#to-old-btn').prop('disabled', false);
        }
    });

    $('#to-new-btn').on('click', function() {
        assignToNewOwner(breezecard_num, new_owner, old_owner);
    });

    $('#to-old-btn').on('click', function() {
        assignToOldOwner(breezecard_num, new_owner, old_owner);
    });

    $('#home').on('click', () => {
        window.location.href = '/administrator.html';
    })
});

var $datatable = $('#cards').DataTable();
var port = 3000;

var initSuspendedCardsTable = function() {
    getSuspendedCards();
}

var formatDate = function(origin) {
    var dateTime = new Date(origin);
    var date = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate();
    var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
    var dateTime = date + ' ' + time;
    return date + ' ' + time
}

var getSuspendedCards = function() {
    var url = `http://localhost:${port}/getSuspendedCards`;

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url,
        success: function (data) {
            $datatable.clear();

            var json = JSON.parse(data);

            var array;
            for (var i = 0; i < json.length; i++) {
                array = [];
                array.push(json[i].BreezecardNum);
                array.push(json[i].Username);
                array.push(formatDate(json[i].DateTime));
                array.push(json[i].BelongsTo);
                $datatable.row.add(array);
            }
            $datatable.draw();
        }
    });
}

var assignToNewOwner = function(breezecard_num, new_owner, old_owner) {
    var url = `http://localhost:${port}/assignToNewOwner`;

    var data = {
        'breezecard_num': breezecard_num,
        'new_owner': new_owner,
        'old_owner': old_owner
    };

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(result) {
            getSuspendedCards();
        }
    });
}

var assignToOldOwner = function(breezecard_num, new_owner, old_owner) {
    var url = `http://localhost:${port}/assignToOldOwner`;

    var data = {
        'breezecard_num': breezecard_num,
        'new_owner': new_owner,
        'old_owner': old_owner
    };

    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(result) {
            getSuspendedCards();
        }
    });
}