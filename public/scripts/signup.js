$(document).ready(init);

function displayData() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 21 || hour <= 4) {
        $("body").attr("style", "background: linear-gradient(to bottom, #000033 10%, #444466 100%) !important;");
    }

}

// function hideAllWarnings(war) {
//     const warningsArray = ['userName-warning', 'email-warning', 'confemail-warning', 'password-warning'];

//     for (let i = 0; i < warningsArray.length; i++) {
//         if (war === warningsArray[i]) {
//             $(`#${war}`).show();
//         }
//         else {
//             $(`#${war}`).hide();
//         }
//     }
// }

function init() {
    displayData();
    $("#signup").click(function () {
      const userName = $('#userName').val();
      const email = $('#email').val();
      const confemail = $('#confemail').val();
      const password = $('#password').val();
     
        if (!userName) {
            $('#userName').css('border-color', 'red');
            $('#userName-warning').show();
        } else if (!email) {
            $('#email').css('border-color', 'red');
            $('#email-warning').show();
        } else if (!confemail) {
            $('#confemail').css('border-color', 'red');
            $('#confemail-warning').show();
            hideAllWarnings('confemail-warning');
        } else if (!password) {
            $('#password').css('border-color', 'red');
            $('#password-warning').show();
        } else if (email !== confemail) {
            $('#confemail-warning').text('Email Must Match').show();
        } else {
            $.ajax({
                url: 'http://0.0.0.0:8080/api/v1/users',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    userName,
                    email,
                    password,   
                }),
                success: function(response) {
                    let Authorization = `${userName}:${email}`;
                    Authorization = btoa(Authorization);
                    $.ajax({
                        url: 'http://0.0.0.0:8080/api/v1/connect',
                        method: 'GET',
                        headers: {
                            'Authorization': `Basic ${Authorization}`
                        },
                        success: function(response) {
                            console.log('Success:', response);
                        },
                        error: function(error) {
                            console.log('Error:', error);
                        }
                    });
                    
                },
                error: function(error) {
                    console.log("3");
                    let message = JSON.parse(error.responseText);
                    message = message['error'];
                    setTimeout(() => {
                        location.reload();
                        
                    }, 1000);
                    $(".alert-danger").text(message).show();
                    
                    
                }
            });
        }

    });
}
