$(document).ready(function () {

    // make signin-error-div invisible
    $("#signin-error-div").hide();

    $("#sign-in-form").submit(function (e) {
        e.preventDefault();

        var s = $("#sign-in-form");
        var d = s.serialize();

        // remove &newPassword=
        d = d.replace('&newPassword=', '');

        $.ajax({
            url: "http://localhost:4000/login",
            type: "POST",
            data: d,
            success: function (result) {
                verifySignIn(result);
            },
        });
    });

    verifySignIn = function (result) {
        switch (result.statusCode) {
            case "OK":
                // show next page
                break;

            case "WRONG_PASSWORD":
            case "NO_USER":
                showSignInError("Invalid username or password"); // show error message
                $("#username").text("");
                $("password").text("");
                break;
        }
    }

    showSignInError = function (msg) {
        $("#signin-error-div").find('#error-msg').text(msg);
        $("#signin-error-div").show();
    }
});