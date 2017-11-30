$(document).ready(function () {

    // make signin-error-div invisible
    $("#register-error-div").hide();

    $("#register-form").submit(function (e) {

        e.preventDefault();
        var d = $(this).serialize(); // data

        $.ajax({
            url: "http://localhost:4000/register",
            type: "POST",
            data: d,
            success: function (result) {
                verifyRegister(result);
            }
        });
    });

    //////////////// Function Definition ///////////////////////////
    var verifyRegister = function (result) {
        switch (result.statusCode) {
            case "OK":
            $("#register").hide();
            $("#passenger-div").show();
            berak;

            case "FAIL":
            showRegisterError(result.message); // show error messag
            break;
        }
    }


    var showRegisterError = function (msg) {
        $("#register-error-div").find('#error-msg').text(msg);
        $("#register-error-div").show();
    }
});