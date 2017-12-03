var stopID;
var port = 3000;

$(document).ready(function () {
    var params = window.location.search.split('?')[1].split('=')[1];
    console.log(params);

    //console.log(typeof params === String);
    stopID = String(params);
    $("#stopid").text(stopID);

    getStationById();

    $('button').on("click", () => {
        var fare = $("#fare").val();
        //alert(typeof Number(fare) === Number);
        if (fare === "") {
            $('#errormessage').text("please provide a fare");
        } else if (Number(fare) < 0 || Number(fare) > 50) {
            $('#errormessage').text("Cannot update fare! fare should between 0 to 50 inclusive");
        } else {
            $('#errormessage').text('updated!');
            updateFare(fare);
        }
    });

    $('#fare').on('change', () => {
        $('#errormessage').text('');
    });

    $("#check").on('click', () => {
        console.log(document.getElementById("check").checked);
        if (document.getElementById("check").checked) {
            //open
            updateStatus(true);
        } else {
            //close
            updateStatus(false);
        }
    })
});


var getStationById = function () {
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getStation/" + stopID;
    var d;

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                var json = JSON.parse(data);
                console.log("data is " + json);

                $('h1').text(String(json[0].Name));
                if (json[0].ClosedStatus === 0) {
                    $('#check').prop('checked', true);
                } else {
                    $('#check').prop('checked', false);
                }
                if (json[0].IsTrain == 1) {
                    $("#intersection").text("Not available for train stations");
                } else {
                    getNearestIntersection();
                }
                $("#fare").attr("placeholder", '$' + parseFloat(json[0].EnterFare, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
            }
        }
    });
}

var updateFare = (fare) => {
    var url = "http://localhost:" + port + "/getStation/" + stopID + "/updateFare";
    var d = {
        "fare": fare
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                //var json = JSON.parse(data);
                console.log(data);
                alert(data.message + ' to ' + fare);
            }
        }
    });
}

var updateStatus = (isOpen) => {
    var status;
    if (isOpen) {
        console.log('open 0');
        status = 0;

    } else {
        console.log('close 1');
        status = 1;
    }

    var url = "http://localhost:" + port + "/getStation/" + stopID + "/updateStatus";
    var d = {
        "status": status
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                //var json = JSON.parse(data);
                console.log(data);
                alert(data.message);
            }
        }
    });
}

var getNearestIntersection = function () {
    // get nearest interesection for bus stations
    var url = "http://localhost:" + port + "/getIntersection/";
    var d = "stopID=" + stopID;

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                var json = JSON.parse(data);
                console.log("data is " + json);
                if (json[0].Intersection != "") {
                    $("#intersection").text(json[0].Intersection);
                } else {
                    $("#intersection").text("N/A");
                }
            }
        }
    });
}
