$(document).ready(init);
import { getTimeInTimeZone } from './dateTimeDistance.js';
import { getTimeFormated } from './dateTimeDistance.js';
import { AmPmFormat } from './dateTimeDistance.js';
import { FToC } from './dateTimeDistance.js';

import queryWeather from './queryWeather.js';


function displayData(weatherData) {
    if (weatherData === null) {
        $(".alert-danger").show();
        setTimeout(function() {
            $(".alert-danger").hide(); 
        }, 3000);
    } else {
        const time = getTimeInTimeZone(weatherData.timezone);
        const [hours, minutes] = time.split(":");
        const now = Number(hours);
        const fullTimenow = `${now}.${Number(minutes)}`;
        let fullSunsetTime = weatherData.days[0].sunset;
        let fullSunriseTime = weatherData.days[0].sunrise;
        const [ sunsetHour, sunsetMinute ] = fullSunsetTime.split(':');
        const [ sunriseHour, sunsriseMinute ] = fullSunriseTime.split(':');
        fullSunsetTime = `${Number(sunsetHour)}.${sunsetMinute}`;
        fullSunriseTime = `${Number(sunriseHour)}.${sunsriseMinute}`;
        console.log(fullSunsetTime, fullTimenow);
        if (Number(fullTimenow) > Number(fullSunsetTime) || Number(fullTimenow) < Number(fullSunriseTime)) {
            $("body").attr("style", "background: linear-gradient(to bottom, #000033 10%, #444466 100%) !important;");
            $(".temp").attr("style", "background: linear-gradient(to right, #000033 10%, #444466 100%) !important;");
            $(".btn.btn-outline-success").css("border-color", "white");
            $(".btn.btn-outline-success").css("color", "white");
            console.log("dark");
        } else {
            $("body").attr("style", "background: linear-gradient(to bottom, #4682B4 10%, #c1e6f5 100%) !important;");
            $(".temp").attr("style", "background: linear-gradient(to right, #4682B4 10%, #c1e6f5 100%) !important;");
            $(".btn.btn-outline-success").css("border-color", "#092f5a");
            $(".btn.btn-outline-success").css("color", "#092f5a");
        }

        const cookies = document.cookie;
        let system = (function(cookies) {
            const arrayOfCookies = cookies.split('; ');
            for (let cookie of arrayOfCookies) {
                const [name, value] = cookie.split('=');
                if (name === 'system') {
                    return value;
                }
            }
            return null;
        })(cookies);

        let dayTemp = Math.round(weatherData.days[0].hours[now].temp);
        let dayMaxTemp = Math.round(weatherData.days[0].tempmax);
        let dayMinTemp = Math.round(weatherData.days[0].tempmin);
        let morningTemp = Math.round(weatherData.days[0].hours[9].temp);
        let afternoonTemp = Math.round(weatherData.days[0].hours[15].temp);
        let eveningTemp = Math.round(weatherData.days[0].hours[20].temp);
        let overnightTemp = Math.round(weatherData.days[0].hours[0].temp);
        let nowTemp = Math.round(weatherData.days[0].hours[now].temp);
        let feelsLikeTime = Math.round(weatherData.days[0].feelslike);

        if(system) {
            $('#dropdown-toggle').text(system);
        }

        if (system && system === '°C') {
            dayTemp = FToC(dayTemp);
            dayMaxTemp = FToC(dayMaxTemp);
            dayMinTemp =  FToC(dayMinTemp);
            morningTemp = FToC(morningTemp);
            afternoonTemp = FToC(afternoonTemp);
            eveningTemp = FToC(eveningTemp);
            overnightTemp = FToC(overnightTemp);
            nowTemp = FToC(nowTemp);
            feelsLikeTime = FToC(feelsLikeTime);
        }

        // First Div 
        $("#resolvedAddress1").text(`${weatherData.resolvedAddress} As of ${weatherData.days[0].datetime} at ${AmPmFormat(time)}`);
        $("#day-temp").text(`${dayTemp}°`);
        $("#description").text(`${weatherData.days[0].description}`);
        $("#tempmax-tempmin").text(`Day ${dayMaxTemp}°. Night ${dayMinTemp}°`);
        $("#Weather-icon-first-first").attr('src', `../images/${weatherData.days[0].hours[now].icon}.png`);


        // Second Div 
        $("#resolvedAddress2").text(`Today's Forcast For ${weatherData.resolvedAddress}`);
        $('#morning-temp').text(`${morningTemp}°`);
        $('#morning-precip').text(`${weatherData.days[0].hours[9].precip}%`);
        $('#Weather-icon-second-first').attr('src', `../images/${weatherData.days[0].hours[9].icon}.png`);

        $('#afternoon-temp').text(`${afternoonTemp}°`);
        $('#afternoon-precip').text(`${weatherData.days[0].hours[15].precip}%`);
        $('#Weather-icon-second-second').attr('src', `../images/${weatherData.days[0].hours[15].icon}.png`);

        $('#evening-temp').text(`${eveningTemp}°`);
        $('#evening-precip').text(`${weatherData.days[0].hours[20].precip}%`);
        $('#Weather-icon-second-third').attr('src', `../images/${weatherData.days[0].hours[20].icon}.png`);

        $('#overnight-temp').text(`${overnightTemp}°`);
        $('#overnight-precip').text(`${weatherData.days[0].hours[0].precip}%`);
        $('#Weather-icon-second-fourth').attr('src', `../images/${weatherData.days[0].hours[0].icon}.png`);


        // Third Div
        const sunrise = weatherData.days[0].sunrise;
        const sunset = weatherData.days[0].sunset;
        // Formating time from String h:m:s to String h:m only "discarding seconds"
        let [h, m, s] = sunrise.split(":");
        let hm = `${h - 0}:${m} am`;
        $("#sunrise-main").text(`${hm}`);

        [h, m, s] = sunset.split(":");
        hm = `${h - 12}:${m} pm`;
        $("#sunset-main").text(`${hm}`);
        $("#tempmax-tempmin-main").text(`${dayMaxTemp}°/${dayMinTemp}°`);
        $("#feelslike-main").text(`${feelsLikeTime}°`);
        $("#humidity-main").text(`${weatherData.days[0].humidity}%`);
        $("#uv-index-main").text(`${weatherData.days[0].uvindex} of 11`);
        $("#visibility-main").text(`${weatherData.days[0].visibility} Mi`);


        // Fourth Div 
        $('#weather-info-header').text(`Weather Today For ${weatherData.resolvedAddress}`);
        $('#now-temp').text(`${nowTemp}°`);
        $('#now-precip').text(`${weatherData.days[0].hours[now].precip}%`);
        $('#Weather-icon-fourth-first').attr('src', `../images/${weatherData.days[0].hours[now].icon}.png`);

        if (now + 1 <= 23) {
            let nowPlusOneTemp = Math.round(weatherData.days[0].hours[now + 1].temp);
            if(system && system === '°C') {
                nowPlusOneTemp = FToC(nowPlusOneTemp);
            }
            $('#nowPlusOne-time').text(getTimeFormated(now + 1));
            $('#nowPlusOne-temp').text(`${nowPlusOneTemp}°`);
            $('#nowPlusOne-precip').text(`${weatherData.days[0].hours[now + 1].precip}%`);
            $('#Weather-icon-fourth-second').attr('src', `../images/${weatherData.days[0].hours[now + 1].icon}.png`);
        } else {
            $('#nowPlusOne-precip').hide();
            $('#nowPlusOne-temp').hide();
            $('#nowPlusOne-time').hide();
            $('#Weather-icon-fourth-second').hide();
        }

        if (now + 2 <= 23) {
            let nowPlusTwoTemp = Math.round(weatherData.days[0].hours[now + 2].temp);
            if(system && system === '°C') {
                nowPlusTwoTemp = FToC(nowPlusTwoTemp);
            }
            $('#nowPlusTwo-time').text(getTimeFormated(now + 2));
            $('#nowPlusTwo-temp').text(`${nowPlusTwoTemp}°`);
            $('#nowPlusTwo-precip').text(`${weatherData.days[0].hours[now + 2].precip}%`);
            $('#Weather-icon-fourth-third').attr('src', `../images/${weatherData.days[0].hours[now + 2].icon}.png`);
        } else {
            $('#nowPlusTwo-time').hide();
            $('#nowPlusTwo-temp').hide();
            $('#nowPlusTwo-precip').hide();
            $('#Weather-icon-fourth-third').hide();
        }

        if (now + 3 <= 23) {
            let nowPlusThreeTemp = Math.round(weatherData.days[0].hours[now + 3].temp);
            if(system && system === '°C') {
                nowPlusThreeTemp = FToC(nowPlusThreeTemp);
            }
            $('#nowPlusThree-time').text(getTimeFormated(now + 3));
            $('#nowPlusThree-temp').text(`${nowPlusThreeTemp}°`);
            $('#nowPlusThree-precip').text(`${weatherData.days[0].hours[now + 3].precip}%`);
            $('#Weather-icon-fourth-fourth').attr('src', `../images/${weatherData.days[0].hours[now + 3].icon}.png`);
        } else {
            $('#nowPlusThree-time').hide();
            $('#nowPlusThree-temp').hide();
            $('#nowPlusThree-precip').hide();
            $('#Weather-icon-fourth-fourth').hide();
        }
 
        if (now + 4 <= 23) {
            let nowPlusFourTemp = Math.round(weatherData.days[0].hours[now + 4].temp);
            if(system && system === '°C') {
                nowPlusFourTemp = FToC(nowPlusFourTemp);
            }
            $('#nowPlusFour-time').text(getTimeFormated(now + 4));
            $('#nowPlusFour-temp').text(`${nowPlusFourTemp}°`);
            $('#nowPlusFour-precip').text(`${weatherData.days[0].hours[now + 4].precip}%`);
            $('#Weather-icon-fourth-fifth').attr('src', `../images/${weatherData.days[0].hours[now + 4].icon}.png`);
        } else {
            $('#nowPlusFour-time').hide();
            $('#nowPlusFour-temp').hide();
            $('#nowPlusFour-precip').hide();
            $('#Weather-icon-fourth-fifth').hide();
        }
        $(".results").show();
        console.log(now);
        console.log(weatherData);
    }
}

function init() {
    const cookies = document.cookie;
    let query = (function(cookies) {
        const arrayOfCookies = cookies.split('; ');
        for (let cookie of arrayOfCookies) {
            const [name, value] = cookie.split('=');
            if (name === 'query') {
                return value;
            }
        }
        return null;
    })(cookies);

    console.log(query);

    if (query !== null) {
        queryWeather(query).then((weatherData) => {
            displayData(weatherData);
        });
    }

    $(".btn-outline-success").click(function() {
        query = $("#query").val();
        document.cookie = `query=${query}`;
        queryWeather(query).then((weatherData) => {
            displayData(weatherData);
        });
    });

    $('.dropdown-item').click(function() {
        event.preventDefault();
        const selectedUnit = $(this).text();
        document.cookie = `system=${selectedUnit}`;
        location.reload();

    });
}