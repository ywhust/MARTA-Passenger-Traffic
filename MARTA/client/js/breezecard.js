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

    $datatable.on('click', 'tbody tr', function() {
        //$datatable.row(this).toggleClass("")
        //console.log('API row values : ', $datatable.row(this).data());
        num = $datatable.row(this).data()[0];
        previousOwner = $datatable.row(this).data()[2];
        console.log(num);
        console.log(previousOwner);
    })

    //newly added
    $('#vbutton').on('click', () => {
        var updatedValue = $('#bvalue').val();
        //alert("value is " + updatedValue);
        //alert(num);
        if (num === undefined) {
            alert("you must select a breezecard first!");
        } else if (updatedValue === "") {
            alert("you must enter fare first!");
        } else if (Number(updatedValue) < 0 || Number(updatedValue) > 1000) {

            alert("value of breezecard must be between 0 to 1000");

        } else {
            updateBreezecardValue(updatedValue);
        }
        
    });

    $('#obutton').on('click', () => {
        var updatedOwner = $('#bowner').val();
        //alert("owner is " + updatedOwner);

        if (num === undefined) {
            alert("you must select a breezecard first!");
        } else if (updatedOwner === "") {
            alert("you must enter an owner first!");
        } else {
            updateOwner(updatedOwner);
            console.log("updated is" + isUpdated);
            if (isUpdated) {
                console.log("inside updated");
                deleteFromConflict(updatedOwner);
                checkPrevious();
                if (count === 0) {
                    alert(previousOwner + "has no breezecard!");
                    generateNewCard();
                }
            }
        }
       
    })

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

///////////////newly added  pumpkin/////////////////////////////////////

var updateBreezecardValue = (updatedValue) => {
    var url = "http://localhost:" + port + "/updateBreezecardValue";
    var d = {
        "updatedValue": updatedValue,
        "num":num
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
                location.reload();
            }
        }
    });
}


var deleteFromConflict = () => {
    var url = "http://localhost:" + port + "/deleteFromConflict";
    var d = {
        "num":num
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
            }
        }
    });
}


var updateOwner = (updatedOwner) => {
    var url = "http://localhost:" + port + "/updateOwner";
    var d = {
        "updatedOwner": updatedOwner,
        "num":num
    }
    $.ajax({
        type: 'POST',
        async: false,
        url: url,
        data: d,
        success: function (data) {
        
            if (data != "") {
                //var json = JSON.parse(data);
                // updated = "true";
                // console.log(updated);
                // console.log(data);
                alert(data);
                isUpdated = true;
                
                
            } else {
                // updated = "false";
                // console.log(updated);
                alert("please enter a valid owner");
                isUpdated = false;
         
                
            }
        }
        // complete: (data) => {
        //     if (data!= " ")
        // }
    });

}


var checkPrevious = () => {
    var url = "http://localhost:" + port + "/checkPrevious";
    var d = {
        "previousOwner": previousOwner,
    }
    $.ajax({
        type: 'POST',
        async: false,
        url: url,
        data: d,
        success: function (data) {
            console.log("inside success");
            console.log(data["0"]["count(*)"]);
            alert(previousOwner + " has " + data["0"]["count(*)"] + " breezecards!");
            count = data["0"]["count(*)"];
        }
    });
}


var generateNewCard = () => {
    var url = "http://localhost:" + port + "/generateNewCard";
    var d = {
        "previousOwner": previousOwner,
    }
    $.ajax({
        type: 'POST',
        url: url,
        data: d,
        success: function (data) {
           // alert("A new breezecard has been generated for " + previousOwner);
        }
    });
    alert("A new breezecard has been generated for " + previousOwner);
}


