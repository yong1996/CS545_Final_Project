$(function() {
    if(location.search){
        let search = location.search;
        let p = search.split("?")[1];
        let a = p.split("&");
        var array = {}
        for(let i in a){
            let s = a[i].split("=");
            array[s[0]] = s[1];
        }
        console.log(array);

        $("#search-pet").remove($('input[name=search-pet]:checked'));
        // $("#search-type").empty();

        $("input[name=search-pet][value=" + array["pet"] + "]").prop('checked', true);
        $("input[name=search-type][value=" + array["type"] + "]").prop('checked', true);
        $("#search-zip").val(array["zip"]);
        $("#search-title").val(array["title"]);
        $("#search-user").val(array["user"]);
    }
    

    // $("#search-form-button").click(function() {
    //     if ($("#search-zip")) {
    //         error("zip should number.");
    //     }
    // });
    
    
});