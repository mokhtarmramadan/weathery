$(document).ready(init);
import { getTimeInTimeZone } from './dateTimeDistance.js';
import { getTimeFormated } from './dateTimeDistance.js';
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
        const $tableBoddy = $('#hourly-table-body');
        const dayHours = weatherData.days[0].hours;
        const timeNow = getTimeInTimeZone(weatherData.timezone);
        console.log(timeNow);
        let [hourNow, minuteNow] = timeNow.split(':');
        for (let i = 0; i < dayHours.length; i++) {
            const hour = dayHours[i];
            const $row = $('<tr>');
            let hourTemp = hour.temp;
            if (system && system === '°C') {
                hourTemp = FToC(hourTemp);
            }
            if (i === Number(hourNow)) {
                $row.append(`<td><strong>${getTimeFormated(i)}</strong></td>`);
                $row.append(`<td><strong>${Math.round(hourTemp)}°</strong></td>`);
                $row.append(`<td><img class="Weather-table-icon" src="../images/${hour.icon}.png" alt="Weather Icon"/></td>`);
                $row.append(`<td><strong>${hour.precip}%</strong></td>`);
            }
            else {
                $row.append(`<td>${getTimeFormated(i)}</td>`);
                $row.append(`<td>${Math.round(hourTemp)}°</td>`);
                $row.append(`<td><img class="Weather-table-icon" src="../images/${hour.icon}.png" alt="Weather Icon"/></td>`);
                $row.append(`<td>${hour.precip}%</td>`);
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

