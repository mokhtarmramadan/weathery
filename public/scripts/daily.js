$(document).ready(init);
import { getTimeInTimeZone } from './dateTimeDistance.js';
import { FToC } from './dateTimeDistance.js';
import queryWeather from './queryWeather.js';

function displayData(weatherData) {
    if (weatherData !== null) {
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
        }
        const $tableBoddy = $('#daily-table-body');
        const days = weatherData.days;
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const $row = $('<tr>');
            const date = new Date(day.datetime);
            const dayName = weekDays[date.getDay()];
            let dayMaxTemp = day.tempmax;
            let dayMinTemp = day.tempmin;

            if (system && system === "°C") {
                dayMaxTemp = FToC(dayMaxTemp);
                dayMinTemp = FToC(dayMinTemp);
            }
            if (i === 0) {
                $row.append(`<td><strong>${dayName}</strong></td>`);
                $row.append(`<td><strong>${Math.round(dayMaxTemp)}°/<small>${Math.round(dayMinTemp)}°</small></strong></td>`);
                $row.append(`<td><img class="Weather-table-icon" src="../images/${day.icon}.png" alt="Weather Icon"/></td>`);
                $row.append(`<td><strong>${day.uvindex}/11</strong></td>`);
            }
            else {
                $row.append(`<td>${dayName}</td>`);
                $row.append(`<td>${Math.round(dayMaxTemp)}°/<small>${Math.round(dayMinTemp)}°</small></td>`);
                $row.append(`<td><img class="Weather-table-icon" src="../images/${day.icon}.png" alt="Weather Icon"/></td>`);
                $row.append(`<td>${day.uvindex}/11</td>`);
            }
            $tableBoddy.append($row);
        }
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
    
    const weatherData = queryWeather(query).then((weatherData) => {
        displayData(weatherData);
    });
}

