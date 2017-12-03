$(document).ready(function () {

    initFlowReportTable();

    $("#starttime").on('change', function () {
        getFlowReport(getFlowReportSearchOption());
    });

    $("#endtime").on('change', function () {
        getFlowReport(getFlowReportSearchOption());
    });
});

var initFlowReportTable = function () {
    $datatable = $('#report').DataTable();
    getFlowReport();
}

var getFlowReportSearchOption = function () {
    var opt = {
        starttime: $("#starttime").val(),
        endtime: $("#endtime").val()
    };
    return opt;
}

var getFlowReport = function(opt) {
    var port = 3000; // server.js listening port
    var url = `http://localhost:${port}/flowReport`;

    if (typeof opt != 'undefined') {
        url += "?starttime=" + opt.starttime;
        url += "&endtime=" + opt.endtime;
    }
    console.log(opt);

    var $datatable = $('#report').DataTable();

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
                array.push(json[i].StartsAt);
                array.push(json[i].FlowIn);
                array.push(json[i].FlowOut);
                array.push(json[i].Flow);
                array.push('$' + json[i].Tripfare.toFixed(2));
                $datatable.row.add(array);
            }
            $datatable.draw();
        }
    });
}