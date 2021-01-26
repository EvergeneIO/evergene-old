//AGE VERIFICATION
function checkuser()
{
    var nsfwcheck = sessionStorage.getItem('nsfw');
    console.log(nsfwcheck);

    if (nsfwcheck == "true")
    {
        //nix
    }
    else
    {
        $('#age').modal('show');
    }
}

//Module Toggle
function toggle(){
    $('#interaction').collapse({
        toggle: true
    })
}

//$("button").click(function(){
//    $("p").toggle();
//});