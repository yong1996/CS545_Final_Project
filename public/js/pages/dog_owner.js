$(function() {
    let updateDogHealthInfo = function(weight, height, bmi, condition, date) {
        $('#dog-weight').text(weight);
        $('#dog-height').text(height);
        $('#dog-bmi').text(bmi);
        $('#dog-health').text(condition);
        $('#dog-date').text(date);
    }

    $('#dog-avatar-upload-btn').click(function() {
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
                    $("#dog-avatar").attr("src", data.avatar);
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

    $("#edit-dog-profile-button").click(function() {
        $("#edit-dog-form-name").val($("#dog-name").text());
        $("#edit-dog-form-type").val($("#dog-type").text());
        $("input[name=gender][value=" + $("#dog-gender").text() + "]").prop('checked', true);
        $("#edit-dog-form-dob").val($("#dog-dob").text());
    });

    $("#add-height-weight-button").click(function() {
        $("#add-height-weight-form-weight").val($("#dog-weight").text());
        $("#add-height-weight-form-height").val($("#dog-height").text());
    });
  
    $("#edit-dog-form").submit(function(event) {
        event.preventDefault();

        $.ajax({
            method: "PUT",
            url: "",
            contentType: "application/json",
            data: JSON.stringify({ dog : {
                name: $("#edit-dog-form-name").val(),
                type: $("#edit-dog-form-type").val(),
                gender: $('input[name=gender]:checked').val(),
                dob: $("#edit-dog-form-dob").val()
            }}),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#edit-dog-profile-modal').modal('hide'); 
                    $("#dog-name").text(data.dog.name);
                    $("#dog-gender").text(data.dog.gender);
                    $("#dog-dob").text(data.dog.dob);
                    $("#dog-type").text(data.dog.type);
                    $("#dog-age").text(data.dog.age);
                    $("#dog-health").text(data.dog.healthCondition);
                    success("dog is updated");
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

    $('#add-height-weight-form').submit(function(event) {
        event.preventDefault();
    
        $.ajax({
            method: "POST",
            url: window.location.pathname + "/heightWeight",
            contentType: "application/json",
            data: JSON.stringify({ heightWeight : {
                height: parseFloat($("#add-height-weight-form-height").val()),
                weight: parseFloat($("#add-height-weight-form-weight").val())
            }}),
            success: function(data){
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                }
                if (data.status == "success") {
                    $('#add-height-weight-modal').modal('hide');
                    updateLabelAndData(bmiChart, data.dog.healthDateList, data.dog.bmiList);
                    updateLabelAndData(weightChart, data.dog.healthDateList, data.dog.weightList);
                    $('#no-data-found-alert-health').hide();
                    $('#dog-health-info').show();
                    $('#dog-health-charts').removeClass('hide-chart');
                    updateDogHealthInfo(data.dog.weight, data.dog.height, data.dog.bmi, data.dog.healthCondition, data.dog.lastHeightWeightUpdate);
                    success("height weight have been updated");
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
                        addDogPhoto(photo.id, photo.photo, true);
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
    $('body').on('click', '.dog-img-container button', function() {
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
                            addDogPhoto(photo.id, photo.photo, true);
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

    $('#edit-dog-form-dob').datepicker({
        format: "yyyy-mm-dd",
        orientation: "top",
        autoclose: true
    });
});