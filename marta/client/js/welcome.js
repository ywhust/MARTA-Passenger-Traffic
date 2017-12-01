$(document).ready(function () {
    
        var port = 4000; // server.js listening port
    
        // 2 - get initial data from the server
        $.ajax({
            //url: 'data/temp.json',
            //dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_breeze_card',
    
            success: function (data) {
    
                var json = JSON.parse(data);
    
                // add one row at a time
                var array;
                for (var i = 0; i < json.length; i++) {
                    $('#breezecards').append('<option>' + json[i].BreezecardNum + '</option>')
                }
    
                //$datatable.draw();
                
            }
        });

        $.ajax({
            //url: 'data/temp.json',
            //dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_station/1',
    
            success: function (data) {
    
                var json = JSON.parse(data);
    
                // add one row at a time
                var array;
                for (var i = 0; i < json.length; i++) {
                    $('#start').append('<option>' + json[i].Name + '- $' + json[i].EnterFare + '</option>')
                }
    
                //$datatable.draw();
                
            }
        });


        $.ajax({
            //url: 'data/temp.json',
            //dataType: 'json',
            type: 'GET',
            contentType: 'application/json',
            url: 'http://localhost:4000/get_station/1',
    
            success: function (data) {
    
                var json = JSON.parse(data);
    
                // add one row at a time
                var array;
                for (var i = 0; i < json.length; i++) {
                    $('#end').append('<option>'  + json[i].Name + '- $' + json[i].EnterFare + '</option>')
                }
    
                //$datatable.draw();
                
            }
        });
    
    });