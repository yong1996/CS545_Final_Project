$(function() {
    $('#signup-form').submit(function(event) {
        let letterNumber = /^[0-9a-zA-Z]+$/;
        let zipNumber = /^[0-9]+$/;
        if ($('#username').val().length < 1) {
            event.preventDefault();
            error("length of username is less than 6");
            return;
        }
        if (!$('#username').val().match(letterNumber)) {
            event.preventDefault();
            error("username should contain only letter and number");
            return;
        }
        if (!$('#zip').val().match(zipNumber)) {
            event.preventDefault();
            error("zip should contain only number");
            return;
        }
        if ($('#password').val().length < 1) {
            event.preventDefault();
            error("length of password is less than 8");
            return;
        }
        if ($('#password').val() != $('#confirm-password').val()) {
            event.preventDefault();
            error("password and confirm password are different");
            return;
        }
    });
});