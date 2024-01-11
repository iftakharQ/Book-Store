function checkAlert() {

    window.localStorage.setItem('Alert', true);
}

if (window.localStorage.getItem('Alert')) {
    window.localStorage.removeItem('Alert');
    showAlert()
}

function showAlert() {

    $('.Alert').removeClass("hide");
    $('.Alert').addClass("show");
    $('.Alert').addClass("showAlert");
    setTimeout(function () {

        $('.Alert').addClass("hide");
        $('.Alert').removeClass("show");
    }, 5000) // first parameter is function that will be called and second perameter is the time or delay;
    // the function will be called after 5 seconds;
}

$('#alert-cross').click(function () {

    $('.Alert').addClass("hide");
    $('.Alert').removeClass("show");
})