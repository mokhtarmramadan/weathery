$(document).ready(init);
import { AmPmFormat } from './dateTimeDistance.js';

function displayData() {
    const date = new Date();
    const hour = date.getHours();
    if (hour >= 21 || hour <= 4) {
        $("body").attr("style", "background: linear-gradient(to bottom, #000033 10%, #444466 100%) !important;");
    }

}


function refreshAccessToken(callback) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/refresh',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'Y-Token': window.refreshToken,
        },
        success: function(response) {
            window.accessToken = response.accessToken;
            localStorage.setItem('accessToken', window.accessToken);
            if (callback) callback();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function deletePlan(planId) {
    $.ajax({
        url: `http://localhost:8080/api/v1/plans/${planId}`,
        method: 'DELETE',
        contentType: 'application/json',
        headers: {
            'X-Token': window.accessToken,
        },
        success: function(response) {
            location.reload();
        },
        error: function(error) {
            if (error.responseText === '{"error":"Unauthorized"}') {
                refreshAccessToken(function() {
                    deletePlan(planId);
                });
            } else {
                setTimeout(() => {
                    location.reload();
                    
                }, 1000);
                $(".alert-danger").text(JSON.parse(error.responseText).error).show();
            }
        }
    });
}


function getPlans() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/plans',
        method: 'GET',
        contentType: 'application/json',
        headers: {
            'X-Token': window.accessToken,
        },
        success: function(response) {
            const $tableBoddy = $("#plan-table");
            for (let i = 0; i < response.length; i++) {
                const plan = response[i];
                const $row = $('<tr>');

                $row.append(`<td id="plan-city" style="font-size: medium;">${plan.planLocation}</td>`);
                $row.append(`<td style="font-size: medium;">Notify me at</td>`);
                $row.append(`<td id="plan-time" style="font-size: medium;">${AmPmFormat(plan.time)}</td>`);
                $row.append(`<td><h3 style="margin-left: auto;"><button name=${plan._id} class="delete-plan-button"><img id="delete-me-icon" src="../images/delete.png"></button></h3></td>`);
 
                $tableBoddy.append($row);
            }
            let planId = '';
            $(".delete-plan-button").click(function() {
                planId = $(this).attr("name");
                deletePlan(planId);
            });
            webPushNotification();
        },
        error: function(error) {
            if (error.responseText === '{"error":"Unauthorized"}') {
                refreshAccessToken(function() {
                    getPlans();
                });
            } else {
                setTimeout(() => {
                    location.reload();
                    
                }, 1000);
                $(".alert-danger").text(JSON.parse(error.responseText).error).show();
            }
        }
    });
}

async function send(publicVapidKey) {
    // Register Service Worker
    console.log("R servic worker");
    const register = await navigator.serviceWorker.register('/scripts/worker.js', {
    scope: '/scripts/'
    });
    console.log("Registering Push");

    // Register Push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push registered");

   // Send Push Notification
   console.log("Sending Push");
   await $.ajax({
    url: 'http://localhost:8080/subscribe',
    method: 'POST',
    body: JSON.stringify(subscription),
    contentType: 'application/json',
    headers: {
        'X-Token': window.accessToken
    }
   });
   console.log("done");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

function webPushNotification () {
    const publicVapidKey = 'BInQ0ZybZJKZTH-bmT87bHzvB8OG9ADxFB2ujsv37DxqBpMEvP-dEtlnJziWux1bSGSqAbb4BXbRatD1EogV08Y';
    if ('serviceWorker' in navigator) {
        send(publicVapidKey).catch(err => console.log(err));
    }
}


function postPlan(city, time) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/plans',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'X-Token': window.accessToken,
        },
        data: JSON.stringify({
            planLocation: city,
            time
        }),
        success: function(response) {
            location.reload();
        },
        error: function(error) {
            if (error.responseText === '{"error":"Unauthorized"}') {
                refreshAccessToken(function() {
                    postPlan(city, time);
                });
            } else {
                setTimeout(() => {
                    location.reload();
                    
                }, 1000);
                $(".alert-danger").text(JSON.parse(error.responseText).error).show();
            }
        }
    });
}

function init() {

    displayData();
    window.accessToken = localStorage.getItem('accessToken');
    window.refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken && !refreshToken) {
        window.location.href = 'http://localhost:8080/signup';
    } else {

        $("#notify-me").click(function() {
            const city = $("#city").val();
            const time = $("#time").val();
            postPlan(city, time);
   
        });
        
        $("#notify-me-button").click(function() {
            if ($("#notify-me-arrow").hasClass("open")) {
                $("#notify-me-arrow").removeClass("open");
                $("#notify-me-arrow").attr('src', '../images/chevron.png');
                $(".forcast-table").hide();
                location.reload();
            } else {
                $("#notify-me-arrow").addClass("open");
                getPlans();
                $("#notify-me-arrow").attr('src', '../images/down-arrow.png');
                $(".forcast-table").show();
            }

        })
    }
}