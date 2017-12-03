$(document).ready(function () {

    // make signin-error-div invisible
    $("#register-error-div").hide();
    $("#password-err").hide();
    $("#card-err").hide();

    $("#register-form").submit(function (e) {

        e.preventDefault();
        var d = $(this).serialize(); // data

        console.log(d);

        $.ajax({
            url: "http://localhost:3000/register",
            type: "POST",
            data: d,
            success: function (result) {
                verifyRegister(result);
            }
        });
    });

    // //////////////// Verify the register information ///////////////
    // var verifyInfo = function() {
    //     var password = $('#password').val();
    //     var password_confirm = $('#password_confirm').val();
    //     if (password != password_confirm) {
    //         $('#password-err').show();
    //         return false;
    //     }
    //     var breezecard_num = $('$breezecard_num').val();
    //     if (breezecard_num.length != 16) {
    //         $('#breezecard_num').show();
    //         return false;
    //     }
    //     return true;
    // }

    //////////////// Function Definition ///////////////////////////
    var verifyRegister = function (result) {
        switch (result.statusCode) {
            case "OK":
                $("#register").hide();
                // $("#passenger-div").show();
                break;

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