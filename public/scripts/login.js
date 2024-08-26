$(document).ready(init);

function displayData() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 21 || hour <= 4) {
        $("body").attr("style", "background: linear-gradient(to bottom, #000033 10%, #444466 100%) !important;");
    }

}


function init() {
    displayData();
    $("#login").click(function () {
        const email = $('#email').val();
        const password = $('#password').val();
       
        if (!email) {
            $('#email').css('border-color', 'red');
            $('#email-warning').show();
        } else if (!password) {
            $('#password').css('border-color', 'red');
            $('#password-warning').show();
        } else {

            let Authorization = `${email}:${password}`;
            Authorization = btoa(Authorization);
            $.ajax({
                url: 'http://0.0.0.0:8080/api/v1/connect',
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${Authorization}`
                },
                success: function(response) {
                    const accessToken = response.accessToken;
                    const refreshToken = response.refreshToken;

                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    window.location.href = 'http://localhost:8080/notify';
                },
                error: function(error) {
                    setTimeout(() => {
                        location.reload();
                        
                    }, 1000);
                    $(".alert-danger").text("Incorrect email or password").show();
                }
            });
                    
        }

    });
}

