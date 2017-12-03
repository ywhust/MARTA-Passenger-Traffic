var port = 3000;
var name;
var stopid;
var fare;
var isTrain;
var closedstatus;

$(document).ready(function () {
    $('#train').attr('checked',true);
    $('#check').attr('checked', true);

    $('#train').change(() => {
        $('#bus').prop('checked', false);
    });
    $('#bus').change(() => {
        $('#train').prop('checked', false);
    });

    $('#create').click( () => {
        name = $('#name').val();
        stopid = $('#stopid').val();
        fare = $('#fare').val();

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
        "closedstatus":closedstatus
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                //var json = JSON.parse(data);
                console.log(data);
                alert(data);
            } else {
                alert("Cannot create station! Either StopID already exists or the combination of name and type already exsits")
            }
        }
    });
}
