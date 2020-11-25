$(function() {
    $("#update-avatar-form").submit(function(event) {
        event.preventDefault();
        startLoading();

        $.ajax({
            method: "POST",
            url:  "/user/avatar",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#update-avatar-modal').modal('hide'); 
                    $("#user-avatar").attr("src", data.avatar);
                    success("avatar is changed");
                } else if (data.status == "error") {
                    error(data.errorMessage);
                }
                $('input[type="file"]').val('');
                $('.uploaded-file-name').text('');
            },
            error: function(data){
                if (data.responseJSON) {
                    error(data.responseJSON.errorMessage);
                } else {
                    error("fail connecting to server");
                }
            }
        });
    });

    $("#add-question-form").submit(function(event) {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/question",
            contentType: "application/json",
            data: JSON.stringify({
                title: $("#add-question-form-title").val(),
                type: $("#add-question-form-description").val(),
                type: $("#add-question-form-type").val(),
                description: $("#add-question-form-description").val()
            }),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#add-question-modal').modal('hide'); 
                    addQuestion(data.question._id, data.question.title, data.question.description);
                    $('#no-data-found-alert-question').hide();
                    success("new question is added");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                if (data.responseJSON) {
                    error(data.responseJSON.errorMessage);
                } else {
                    error("fail connecting to server");
                }
            }
        });
    });
  
    function addQuestion(id, title, description) {
        let questionContainer = $('<div class="col-lg-3 col-md-4 col-6 mb-4 question-container">');
        let button = $('<button type="button" class="btn btn-danger btn-sm btn-round btn-shadow btn-delete-question position-absolute">delete</button>')
        let card = $('<div class="card">');
        let a = $('<a href="/question/' + id + '">');
        let avatarContainer = $('<div class="avatar-container">')
        let img = $('<img src="/public/img/avatar/default-question.png" class="card-img-top" alt="question avatar">');
        if (avatar) {
            img = $('<img src="' + avatar + '" class="card-img-top" alt="question avatar">');
        }
        avatarContainer.append(img);
        let cardbody = $('<div class="card-body">');
        let cardtitle = $('<h2 class="card-title display-4 mb-0">' + title + '</h2>');
        cardbody.append(cardtitle)
        a.append(avatarContainer).append(cardbody);
        card.append(a);
        questionContainer.append(button);
        questionContainer.append(card);

        $('#questions-container').prepend(questionContainer);
    }

    $('body').on('click', '.question-container button', function() {
        startLoading();

        let questionSingleContainer = $(this).parent();
        let questionContainer = questionSingleContainer.parent();
        let questionURI = $(this).next().find('a').attr('href');
        $.ajax({
            method: "DELETE",
            url: questionURI,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    questionSingleContainer.remove();
                    if (questionContainer.children().length === 0) {
                        $('#no-data-found-alert-question').show();
                    }
                    success("question is deleted");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                if (data.responseJSON) {
                    error(data.responseJSON.errorMessage);
                } else {
                    error("fail connecting to server");
                }
            }
        });
    });

    $('#user-avatar-upload-btn').click(function() {
        $('#user-avatar-upload').click();
    });

    $('#user-avatar-upload').change(function() {
        let file = $(this).val().split('\\');
        let fileName = file[file.length - 1];
        $('#uploaded-file-name').text(fileName);
    });

    $('#change-password-form').submit(function(event){
        event.preventDefault();
        if ($("#change-password-form-new-password").val().length < 1) {
            error("length of password is less than 8");
            return;
        }
        if ($("#change-password-form-new-password").val() != $("#change-password-form-confirm-new-password").val()) {
            error("password and confirm password are different");
            return;
        }

        $.ajax({
            method: "POST",
            url: "/user/password",
            contentType: "application/json",
            data: JSON.stringify({
                oldpassword: $("#change-password-form-old-password").val(),
                newpassword: $("#change-password-form-new-password").val()
            }),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#change-password-modal').modal('hide'); 
                    success("password is changed");
                } else {
                    error(data.errorMessage);
                }
            },
            error: function(data){
                if (data.responseJSON) {
                    error(data.responseJSON.errorMessage);
                } else {
                    error("fail connecting to server");
                }
            }
        });
    });
});