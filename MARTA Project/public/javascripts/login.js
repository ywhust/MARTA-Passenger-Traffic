// The following code will be executed when document is ready
$(document).ready(function () {

    // make signin-error-div invisible
    $("#signin-error-div").hide();
    $("#passenger-div").hide();

    // hide error message div when username or password field detects click
    $("#sign-in-form").find("#username").on("click keyup", function(){
        $("#signin-error-div").hide();
    });
    $("#sign-in-form").find("#username").on("click keyup",function(){
        $("#signin-error-div").hide();
    });

    $("#sign-in-form").submit(function (e) {

        e.preventDefault(); // important - prevent default action

        var d = $(this).serialize(); // data

        $.ajax({
            url: "http://localhost:3000/login",
            type: "POST",
            data: d,
            success: function (result) {
                verifySignIn(result);
            },
        });
    });
});

//////////////// Function Definition ///////////////////////////
var verifySignIn = function (result) {
    switch (result.statusCode) {
        case "OK":
            // check user type - passenger or admin
            if (result.isAdmin == 'TRUE') {
                // show admin panel
                $("#login").hide();
                window.location.href = '/administrator.html';
            } else {
                // show welcome passenger panel
                $("#login").hide();
                // $("#passenger-div").show();
                var username = $('#username').val();
                window.location.href = `/passengerBreezecards.html?username=${username}`;
            }
            break;

        case "FAILED":
            showSignInError("Invalid username or password"); // show error message
            $("#username").text("");
            $("password").text("");
            break;
    }
}

var showSignInError = function (msg) {
    $("#signin-error-div").find('#error-msg').text(msg);
    $("#signin-error-div").show();
}
