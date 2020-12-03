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
        console.log(array["pet"]);
        console.log(array["qtype"]);

        $("input[name=search-pet][value=" + array["pet"] + "]").prop('checked', true);
        $("input[name=search-type][value=" + array["qtype"] + "]").prop('checked', true);
        $("#search-zip").val(array["zip"]);
        $("#search-title").val(array["title"]);
        $("#search-user").val(array["user"]);
    }
});