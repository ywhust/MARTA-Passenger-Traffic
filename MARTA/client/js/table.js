$(document).ready(function () {

    var port = 4000; // server.js listening port

    // 1 - create/init datatable
    var $datatable = $('#breezecards').DataTable({
        select: {
            style: 'os'
        },
        "dom": '<l<t>ip>',
        "ordering": false
    });

    // 2 - get initial data from the server
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'http://localhost:4000/get_breeze_card',

        success: function (data) {
            // return json - table
            // update the table
            $datatable.clear();

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
    $("#owner").on("change keyup", function () {
        var owner = $(this).val(); // owner filter

        $.ajax({
            //url: 'data/temp1.json',
            //dataType: 'json',

            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_owner/' + owner,

            success: function (data) {
                // return json - table
                // update the table
                $datatable.clear();

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
            },

            // error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
            // }       
        });
    });

    // track value from field
    $("#min").on("change keyup", function () {
        var min = $(this).val(); // min filter

        $.ajax({
            //url: 'data/temp1.json',
            //dataType: 'json',

            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_min/' + min,

            success: function (data) {
                // return json - table
                // update the table
                $datatable.clear();

                var json = JSON.parse(data);

                // add one row at a time
                var array;
                for (var i = 0; i < json.length; i++) {
                    array = [];
                    array.push(json[i].BreezecardNum);
                    array.push(json[i].Value);
                    array.push(json[i].BelongsTo)
                    $datatable.row.add(array);
                }

                $datatable.draw();
            },

            // error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            //alert(thrownError);
            // }       
        });
    });

    $('#checkbox').click(function () {
        if ($('input[id=checkbox]').prop('checked')) {
            $.ajax({
                //url: 'data/temp1.json',
                //dataType: 'json',

                type: 'GET',
                contentType: 'application/json',
                url: 'http://localhost:4000/get_suspended/',

                success: function (data) {
                    // return json - table
                    // update the table
                    $datatable.clear();

                    var json = JSON.parse(data);

                    // add one row at a time
                    var array;
                    for (var i = 0; i < json.length; i++) {
                        array = [];
                        array.push(json[i].BreezecardNum);
                        array.push(json[i].Value);
                        array.push(json[i].BelongsTo)
                        $datatable.row.add(array);
                    }

                    $datatable.draw();
                },
            });
        } else {
            $.ajax({
                //url: 'data/temp1.json',
                //dataType: 'json',

                type: 'GET',
                contentType: 'application/json',
                url: 'http://localhost:4000/get_owner/',

                success: function (data) {
                    // return json - table
                    // update the table
                    $datatable.clear();

                    var json = JSON.parse(data);

                    // add one row at a time
                    var array;
                    for (var i = 0; i < json.length; i++) {
                        array = [];
                        array.push(json[i].BreezecardNum);
                        array.push(json[i].Value);
                        array.push(json[i].BelongsTo)
                        $datatable.row.add(array);
                    }

                    $datatable.draw();
                },
            });
        }
    });
});