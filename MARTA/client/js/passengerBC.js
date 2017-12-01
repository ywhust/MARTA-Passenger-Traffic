// The following code will be executed when document is ready
$(document).ready(function () {

    // initialize the datatable;
    initSelectLists();

    //logout button
    $("#logout").click(function () {

        $.ajax({
            url: "http://localhost:4000/logout",
            type: "POST",
            success: function (result) {
                verifySignIn(result);
            },
        });
        window.location.href='/index.html';
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

// var getBalance = $("#sel1").change(function () {
//     var opt = {
//         cardnum: $("#sel1").val()
//     };
//     // get breeze cards based on a given owner (wild card search)
//     var url = "http://localhost:" + port + "/getBreezeCardNums";
//     var d;
//     if (typeof opt != 'undefined') {
//         d += "&cardnum=" + opt.cardnum;
//     }

//     $.ajax({
//         type: 'POST',
//         url: url,
//         data: d,
//         success: function (data) {

//             if (data != "") {
//                 var json = JSON.parse(data);
//                 //change balance label to match balance for selected breezecard
//                 console.log(json[0].Value);
//                 $("#balance").text(json[0].Value);
//             }
//         }
//     });
// });

var updateBalance = $("#sel1").change(function () {
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
                        + " - " + json[i].EnterFare + '</option>')
                    $('#sel3').append('<option>' + json[i].Name + '</option>')
                    console.log(json[i].EnterFare);
                }
            }
        }
    });
}
