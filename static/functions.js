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