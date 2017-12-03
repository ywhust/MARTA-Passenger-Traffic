var port = 3000;
var name;
var stopid;
var fare;
var isTrain;
var closedstatus;
var intersection;

$(document).ready(function () {
    $('#bus').attr('checked',true);
    $('#check').attr('checked', true);

    $('#train').change(() => {
        $('#bus').prop('checked', false);
        $('#intersection').prop('disabled', true);
    });
    $('#bus').change(() => {
        $('#train').prop('checked', false);
        $('#intersection').prop('disabled', false);
    });

    $('#create').click( () => {
        name = $('#name').val();
        stopid = $('#stopid').val();
        fare = $('#fare').val();
        intersection = $('#intersection').val();

        if ($('#bus').is(':checked')) {
            isTrain = 0;
        } else {
            isTrain = 1;
        }

        if ($('#check').is(':checked')) {
            closedstatus = 0;
        } else {
            closedstatus = 1;
        }

        if (name === "" || stopid === "" || fare === "") {
            $('#errormessage').text('please fill in all required fields');
        } else if (Number(fare) < 0 || Number(fare) > 50) {
            alert("fare must be between 0.00 to 50.00");
        } else {
            $('#errormessage').text("");
            // alert(name);
            // alert(stopid);
            // alert(fare);
            // alert(isTrain);
            // alert(closedstatus);
            createStation();
        }
    });
});

var createStation = () => {
    var url = "http://localhost:" + port + "/createStation";
    var d = {
        "name":name,
        "StopID": stopid,
        "fare":fare,
        "isTrain":isTrain,
        "closedstatus":closedstatus,
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
            console.log("data: " + data);
            if (data != "") {
                //var json = JSON.parse(data);
                console.log("message: " + data.message);
                alert(data.message);

            } else {
                alert("Cannot create station! Either StopID already exists or the combination of name and type already exists")
            }
        },
        // error: function(XMLHttpRequest, textStatus, errorThrown) {
        //     alert("Status: " + textStatus); alert("Error: " + XMLHttpRequest.responseText);
        // },
        complete: function (data) {
            if (d.isTrain == 0) {
               // createIntersection();
            }
        }
    });
}

var createIntersection = () => {
    var url = "http://localhost:" + port + "/createIntersection";
    var d = {
        "StopID": stopid,
        "intersection":intersection,
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
            alert(data.message);
        }
    });
}
