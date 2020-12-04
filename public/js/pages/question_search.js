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
        
        $('#search-pet option:contains('+array["pet"] +')').prop('selected',true);
        $('#search-type option:contains('+array["type"] +')').prop('selected',true);
        $("#search-zip").val(array["zip"]);
        $("#search-title").val(array["title"]);
        $("#search-owner").val(array["owner"]);

        if($("#page-link-1").attr("href")){
            if($("#previous-page-link").attr("href")) {
                let pp = $("#previous-page-link").attr("href")
                let ppl = pp.slice(1);
                if(array["page"]){
                    let s = search.split("page")[0];
                    let sppl = s + ppl
                    $("#previous-page-link").attr("href", sppl)
                } else {
                    let sppl = search + "&" + ppl;
                    $("#previous-page-link").attr("href", sppl)
                }
            }

            if($("#next-page-link").attr("href")) {
                let np= $("#next-page-link").attr("href")
                let npl = np.slice(1);
                if(array["page"]){
                    let s = search.split("page")[0];
                    let snpl = s + npl
                    $("#next-page-link").attr("href", snpl)
                } else {
                    let snpl = search + "&" + npl;
                    $("#next-page-link").attr("href", snpl)
                }
            }
        
            let pl = [];
            for(let i=1; i<9999; i++) {
                if($("#page-link-"+i).attr("href")){
                    let p = $("#page-link-"+i).attr("href");
                    pl[i-1] = p.slice(1);
                } else {
                    break;
                }
            }
            for(let i = 0; i<pl.length; i++){
                let j = i+1;
                if(array["page"]){
                    let s = search.split("page")[0];
                    let spl = s + pl[i];
                    $("#page-link-"+j).attr("href", spl);
                } else {
                    let spl = search + "&" + pl[i];
                    $("#page-link-"+j).attr("href", spl);
                }
            }
        }
        

    }
});