$(function() {
    $('#question-avatar-upload-btn').click(function() {
        $('#update-avatar-form-file').click();
    });

    $('#upload-photo-btn').click(function() {
        $('#upload-photo-form-file').click();
    });

    $('#update-avatar-form-file').change(function() {
        let file = $(this).val().split('\\');
        let fileName = file[file.length - 1];
        $('#uploaded-avatar-name').text(fileName);
    });

    $('#upload-photo-form-file').change(function() {
        let file = $(this).val().split('\\');
        let fileName = file[file.length - 1];
        $('#uploaded-photo-name').text(fileName);
    });

    $("#update-avatar-form").submit(function(event) {
        event.preventDefault();
        startLoading();

        $.ajax({
            method: "POST",
            url: urlpath + "/avatar",
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
                    $("#question-avatar").attr("src", data.avatar);
                    success("avatar is updated");
                } else {
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

    $("#edit-question-profile-button").click(function() {
        $("#edit-question-form-title").val($("#question-title").text());
        $("#edit-question-form-pet").val($("#question-pet").text());
        $("input[name=type][value=" + $("#question-type").text() + "]").prop('checked', true);
        $("#edit-question-form-description").val().text();
    });
  
    $("#edit-question-form").submit(function(event) {
        event.preventDefault();

        $.ajax({
            method: "PUT",
            url: "",
            contentType: "application/json",
            data: JSON.stringify({ question : {
                title: $("#edit-question-form-title").val(),
                pet: $("#edit-question-form-pet").val(),
                type: $('input[name=type]:checked').val(),
                description: $("#edit-question-form-description").val(),
            }}),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#edit-question-profile-modal').modal('hide'); 
                    location.reload();
                    success("question is updated");
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

    $("#upload-photo-form").submit(function(event) {
        event.preventDefault();
        startLoading();

        $.ajax({
            method: "POST",
            url: urlpath + "/photos",
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#upload-photo-modal').modal('hide'); 
                    $("#photos").empty();
                    for(let photo of data.photos) {
                        addQuestionPhoto(photo.id, photo.photo, true);
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").data("current-page", "1");
                    $("#no-data-found-alert-photo").hide();
                    success("new photo is uploaded");
                } else {
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

    // delete photo
    $('body').on('click', '.question-img-container button', function() {
        startLoading();
        let photoId = $(this).next().find('img').attr('id');
        $.ajax({
            method: "DELETE",
            url: urlpath + "/photo/" + photoId,
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $("#photos").empty();
                    if (data.photos.length) {
                        for(let photo of data.photos) {
                            addQuestionPhoto(photo.id, photo.photo, true);
                        }
                    } else {
                        $("#no-data-found-alert-photo").show();
                    }
                    if (data.isLastPage) $("#load-more-photos").hide();
                    else $("#load-more-photos").show();
                    $("#load-more-photos").data("current-page", "1");
                    success("photo is deleted");
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
    
    initLoadMorePhoto(true);

    initSubmitCommentForm();
    initLoadMoreComment();
});