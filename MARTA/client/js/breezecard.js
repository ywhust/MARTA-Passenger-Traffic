// The following code will be executed when document is ready
$(document).ready(function () {

    // initialize the datatable;
    initBreezeCardTable();

    // add event handler to track owner field
    $("#owner").on("keyup", function () {
        getBreezeCards(getBreezeCardSearchOption());
    });

    // add event handler to track card number field
    $("#cardnum").on("keyup", function () {
        getBreezeCards(getBreezeCardSearchOption());
    });

    // add event handler to track card number field
    $("#min").on("keyup", function () {
        getBreezeCards(getBreezeCardSearchOption());
    });

    // add event handler to track card number field
    $("#max").on("keyup", function () {
        getBreezeCards(getBreezeCardSearchOption());
    });

    $("#checkbox").on("click", function () {
        getBreezeCards(getBreezeCardSearchOption());
    });

});


//////////////////////////// Function Definition Block //////////////////////////
var port = 4000; // server.js listening port
var $datatable;

var initBreezeCardTable = function () {
    // 1 - create/init datatable
    $datatable = $('#breezecards').DataTable({
        "dom": '<l<t>ip>',
        "ordering": false,
        select: {
            style: 'single'
        }
    });

    // 2 - get initial data from the server
    getBreezeCards();
}

var getBreezeCardSearchOption = function () {
    var opt = {
        owner: $("#owner").val(), //add constain $("breezecard").find("#owner").val()
        cardnum: $("#cardnum").val(),
        min: $("#min").val(),
        max: $("#max").val(),
        suspended: $("#checkbox").prop('checked'),
    };
    return opt;
}

var getBreezeCards = function (opt) {
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getBreezeCard";
    var d;

    if (typeof opt != 'undefined') {
        d = "owner=" + opt.owner;
        d += "&cardnum=" + opt.cardnum;
        d += "&min=" + opt.min;
        d += "&max=" + opt.max;
        d += "&suspended=" + opt.suspended;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
            // check the return status
            if (typeof data.statusCode != "undefined" &&
                data.statusCode == "NOT_AUTHORIZED") {
                alert("Not Authorized");
                return;
            }

            // update the table
            $datatable.clear();

            if (data != "") {
                var json = JSON.parse(data);

                // add one row at a time
                var array;
                for (var i = 0; i < json.length; i++) {
                    array = [];
                    array.push(json[i].BreezecardNum);
                    array.push(json[i].Value);
                    array.push(json[i].BelongsTo);
                    $datatable.row.add(array);
                }
            }

            // re-draw the table
            $datatable.draw();
        }
    });
}


