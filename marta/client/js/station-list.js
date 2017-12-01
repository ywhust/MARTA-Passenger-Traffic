$(document).ready(function () {
    
        var port = 4000; // server.js listening port
    
        // 1 - create/init datatable
        var $datatable = $('#stations').DataTable();
    
        // 2 - get initial data from the server
        $.ajax({
            //url: 'data/temp.json',
            //dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_station/1',
    
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
                    array.push(json[i].Name);
                    array.push(json[i].StopID);
                    array.push('$' + json[i].EnterFare);
                    if (json[i].ClosedStatus === 0) {
                        array.push('Closed');
                    } else {
                        array.push('Open');
                    }
                    //array.push(json[i].ClosedStatus);
                    $datatable.row.add(array);
                    //$datatable.row.add([1,2,3]);
                }
    
                $datatable.draw();
            }
        });
    
    });