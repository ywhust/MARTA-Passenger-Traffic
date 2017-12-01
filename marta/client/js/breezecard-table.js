$(document).ready(function () {

    var port = 4000; // server.js listening port

    // 1 - create/init datatable
    var $datatable = $('#breezecards').DataTable();

    // 2 - get initial data from the server
    $.ajax({
        //url: 'data/temp.json',
        //dataType: 'json',
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:4000/get_breeze_card',

        success: function (data) {
            // check the return status
            // if (typeof data.statusCode != "undefined" && 
            //     data.statusCode == "NOT_AUTHORIZED")
            //     alert("Not Authorized");
            //     return;

            // return json - table
            // update the table
            $datatable.clear();
            //$datatable.rows.add(data.data); // this is for json file

            var json = JSON.parse(data);

            // add one row at a time
            var array;
            for (var i = 0; i < json.length; i++) {
                array = [];
                array.push(json[i].BreezecardNum);
                array.push(json[i].Value);
                array.push(json[i].BelongsTo)
                $datatable.row.add(array);
                //$datatable.row.add([1,2,3]);
            }

            $datatable.draw();
        }
    });

    // track owner field
    $("#owner").on("change", function () {
        var owner = $(this).val(); // owner filter

        $.ajax({
            //url: 'data/temp1.json',
            //dataType: 'json',


            //type: 'GET', 
            // url: 'http://example/functions.php', // URL for the backend
            //data: { get_param: "card_number="+ owner}, 

            success: function (data) {
                // return json - table
                // update the table
                $datatable.clear();
                $datatable.rows.add(data.data);
                $datatable.draw();
            },

            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    });
});