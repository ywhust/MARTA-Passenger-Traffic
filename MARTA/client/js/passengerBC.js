//global variable to keep track of time of current trip 
var tripTime
var stationType

// The following code will be executed when document is ready
$(document).ready(function () {
    // initialize the datatable;
    initSelectLists();

    //hide "in progress" label and "end trip" button
    $("#progress").hide();
    $("#end").hide();

    //logout button
    $("#logout").click(function () {

        $.ajax({
            url: "http://localhost:4000/logout",
            type: "POST",
            success: function (result) {
                verifySignIn(result);
            },
        });
        window.location.href = '/index.html';
    });

    $("#start").click(function () {
        //splits startsAt field
        var str = $("#sel2").val();
        var splitStartsAt = str.split(" - $");

        //get current datetime
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        tripTime = dateTime;

        var opt = {
            cardnum: $("#sel1").val(),
            startsAt: splitStartsAt[0],
            tripFare: splitStartsAt[1],
            startTime: dateTime,
        };

        var url = "http://localhost:" + port + "/startTrip";
        var d = "cardnum=" + opt.cardnum + "&startsAt=" + opt.startsAt
            + "&tripFare=" + opt.tripFare + "&startTime=" + opt.startTime;

        $.ajax({
            url: url,
            data: d,
            type: "POST",
            success: function (data) {
                console.log("trip post success!")
                if (data.message.substring(0, 20) === "Cannot add or update") {
                    alert("Please select a breezecard!");
                } else {
                    alert(data.message)
                    if (data.message === "Trip started!") {
                        $("#start").hide();
                        $("#progress").show();
                        $("#sel2").prop('disabled', 'disabled');
                        $("#end").show();
                    }
                }
            },
        });
    });

    $("#end").click(function () {

        //splits startsAt field
        var str = $("#sel2").val();
        var splitStartsAt = str.split(" - $");

        var opt = {
            cardnum: $("#sel1").val(),
            startsAt: splitStartsAt[0],
            tripFare: splitStartsAt[1],
            startTime: tripTime,
            endsAt: $("#sel3").val(),
        };

        var url = "http://localhost:" + port + "/endTrip";
        var d = "cardnum=" + opt.cardnum + "&startsAt=" + opt.startsAt
            + "&tripFare=" + opt.tripFare + "&startTime=" + opt.startTime
            + "&endsAt=" + opt.endsAt;

        $.ajax({
            url: url,
            data: d,
            type: "POST",
            success: function (data) {
                console.log("trip post success!")
            },
        });
    }); 

});


//////////////////////////// Function Definition Block //////////////////////////
var port = 4000; // server.js listening port
var $datatable;

var initSelectLists = function () {
    // 1 - get a list of breezecards
    getBreezeCardNums();
    getStations();
    //2 - add breezecards to the select list
}

var updateStartsAt = $("#sel2").change(function () {
    getNewStations();
});

var getNewStations = function () {
    //splits startsAt field
    var str = $("#sel2").val();
    console.log("string: " + str)
    var splitStartsAt = str.split(" - $");

    var opt = {
        startsAt: splitStartsAt[0],
    };
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getNewStations";
    var d = "&startsAt=" + opt.startsAt

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                var json = JSON.parse(data);
                $("#sel3").children().remove()
                // add one row at a time
                for (var i = 0; i < json.length; i++) {
                    $('#sel3').append('<option>' + json[i].Name + '</option>')
                    console.log(json[i].Name);
                }
            }
        }
    });
};

var updateBalance = $("#sel1").change(function () {
    console.log("asdf");
    getBalance();
});

var getBalance = function () {
    var opt = {
        cardnum: $("#sel1").val(),
    };
    console.log("called sucessfully")
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getBreezeCardNums";
    var d;
    if (typeof opt != 'undefined') {
        d += "&cardnum=" + opt.cardnum;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {

            if (data != "") {
                var json = JSON.parse(data);
                //change balance label to match balance for selected breezecard
                console.log(json[0].Value);
                $("#balance").text(json[0].Value);
            }
        }
    });
};

var getBreezeCardNums = function () {
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getBreezeCardNums";
    var d;

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
            // check the return status
            // if (typeof data.statusCode != "undefined" &&
            //     data.statusCode == "NOT_AUTHORIZED") {
            //     alert("Not Authorized");
            //     return;
            // }

            if (data != "") {
                var json = JSON.parse(data);

                // add one row at a time
                for (var i = 0; i < json.length; i++) {
                    $('#sel1').append('<option>' + json[i].BreezecardNum + '</option>')
                    console.log(json[i].BreezecardNum);
                }
            }
        }
    });
}

var getStations = function () {
    // get breeze cards based on a given owner (wild card search)
    var url = "http://localhost:" + port + "/getStation";
    var d;

    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
            // check the return status
            // if (typeof data.statusCode != "undefined" &&
            //     data.statusCode == "NOT_AUTHORIZED") {
            //     alert("Not Authorized");
            //     return;
            // }

            if (data != "") {
                var json = JSON.parse(data);

                // add one row at a time
                for (var i = 0; i < json.length; i++) {
                    // add stations to the start/end at select lists
                    $('#sel2').append('<option>' + json[i].Name
                        + " - $" + json[i].EnterFare + '</option>')
                    // $('#sel3').append('<option>' + json[i].Name + '</option>')
                    // console.log(json[i].EnterFare);
                }
            }
        },
        complete: function(data) {
            getNewStations();
        }
    });
}

