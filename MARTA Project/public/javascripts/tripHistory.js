var username = String(window.location.search.split('?')[1].split('=')[1]);
console.log(username);
// setTimeout(function() {}, 10000);

$(document).ready(function () {

    initTripHistoryTable();

    $("#starttime").on('change', function () {
        getTripHistory(getTripHistorySearchOption());
    });

    $("#endtime").on('change', function () {
        getTripHistory(getTripHistorySearchOption());
    });
});

var initTripHistoryTable = function () {
    $datatable = $('#trips').DataTable({
        "dom": '<l<t>ip>',
    });
    getTripHistory(getTripHistorySearchOption());
}

var getTripHistorySearchOption = function () {
    var opt = {
        "username": username,
        "starttime": $("#starttime").val(),
        "endtime": $("#endtime").val()
    };
    return opt;
}

var getTripHistory = function(opt) {
    var port = 3000; // server.js listening port
    var url = `http://localhost:${port}/tripHistory`;

    if (typeof opt != 'undefined') {
        url += "?username=" + opt.username;
        url += "&starttime=" + opt.starttime;
        url += "&endtime=" + opt.endtime;
    }
    console.log(opt);

    var $datatable = $('#trips').DataTable();

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: url,
        success: function (data) {
            $datatable.clear();

            var json = JSON.parse(data);

            var array;
            for (var i = 0; i < json.length; i++) {
                array = [];
                array.push(formatDate(json[i].StartTime));
                array.push(json[i].Source);
                array.push(json[i].Destination);
                array.push('$' + json[i].Tripfare.toFixed(2));
                array.push(json[i].BreezecardNum);
                $datatable.row.add(array);
            }
            $datatable.draw();
        }
    });
}

var formatDate = function(origin) {
    var dateTime = new Date(origin);
    var date = dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate();
    var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
    var dateTime = date + ' ' + time;
    return date + ' ' + time
}