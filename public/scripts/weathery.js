$(document).ready(init);

function queryWeather(query) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:8080/weather',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                query: `
                    {
                        getWeather(placeLocation: "${query}") {
                            resolvedAddress
                            timezone
                            days {
                                datetime
                                tempmax
                                tempmin
                                feelslike
                                description
                                icon
                                sunrise
                                sunset
                                uvindex
                                visibility
                                humidity
                                hours {
                                    temp
                                    precip
                                    icon
                                }
                            }
                        }
                    }
                `
            }),
            success: function(response) {
                if (response.data['getWeather'] === null) {
                    resolve(null);
                } else {
                    const weatherData = response.data['getWeather'];
                    resolve(weatherData);
                }
            },
            error: function(error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

function getTimeInTimeZone(timeZone) {
    const options = { timeZone, hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date());
}

function getTimeFormated(hour) {
    let newHour = Number(hour);
    if (newHour === 0) {
        return '12 am';
    } else if (newHour > 0 && newHour <= 12) {
        return `${newHour} am`;
    } else {
        newHour = newHour - 12;
        return `${newHour} pm`;
    }
}

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
        $(".results").show();
        // First Div 
        $("#resolvedAddress1").text(`${weatherData.resolvedAddress} As of ${weatherData.days[0].datetime} at ${time}`);
        $("#day-temp").text(`${weatherData.days[0].hours[0].temp}°`);
        $("#description").text(`${weatherData.days[0].description}`);
        $("#tempmax-tempmin").text(`Day ${weatherData.days[0].tempmax}°. Night ${weatherData.days[0].tempmin}°`);
        $("#Weather-icon-first-first").attr('src', `../images/${weatherData.days[0].icon}.png`);


        // Second Div 
        $("#resolvedAddress2").text(`Today's Forcast For ${weatherData.resolvedAddress}`);
        $('#morning-temp').text(`${weatherData.days[0].hours[9].temp}°`);
        $('#morning-precip').text(`${weatherData.days[0].hours[9].precip}%`);
        $('#Weather-icon-second-first').attr('src', `../images/${weatherData.days[0].hours[9].icon}.png`);

        $('#afternoon-temp').text(`${weatherData.days[0].hours[15].temp}°`);
        $('#afternoon-precip').text(`${weatherData.days[0].hours[15].precip}%`);
        $('#Weather-icon-second-second').attr('src', `../images/${weatherData.days[0].hours[15].icon}.png`);

        $('#evening-temp').text(`${weatherData.days[0].hours[19].temp}°`);
        $('#evening-precip').text(`${weatherData.days[0].hours[19].precip}%`);
        $('#Weather-icon-second-third').attr('src', `../images/${weatherData.days[0].hours[19].icon}.png`);

        $('#overnight-temp').text(`${weatherData.days[0].hours[0].temp}°`);
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
        $("#tempmax-tempmin-main").text(`${weatherData.days[0].tempmax}°/${weatherData.days[0].tempmin}°`);
        $("#feelslike-main").text(`${weatherData.days[0].feelslike}`);
        $("#humidity-main").text(`${weatherData.days[0].humidity}%`);
        $("#uv-index-main").text(`${weatherData.days[0].uvindex} of 11`);
        $("#visibility-main").text(`${weatherData.days[0].visibility} Mi`);


        // Fourth Div 
        $('#weather-info-header').text(`Weather Today For ${weatherData.resolvedAddress}`);
        $('#now-temp').text(`${weatherData.days[0].hours[now].temp}°`);
        $('#now-precip').text(`${weatherData.days[0].hours[now].precip}%`);
        $('#Weather-icon-fourth-first').attr('src', `../images/${weatherData.days[0].hours[now].icon}.png`);

        if (now + 1 <= 23) {
            $('#nowPlusOne-time').text(getTimeFormated(now + 1));
            $('#nowPlusOne-temp').text(`${weatherData.days[0].hours[now + 1].temp}°`);
            $('#nowPlusOne-precip').text(`${weatherData.days[0].hours[now + 1].precip}%`);
            $('#Weather-icon-fourth-second').attr('src', `../images/${weatherData.days[0].hours[now + 1].icon}.png`);
        } else {
            $('#nowPlusOne-precip').hide();
            $('#nowPlusOne-temp').hide();
            $('#nowPlusOne-time').hide();
            $('#Weather-icon-fourth-second').hide();
        }

        if (now + 2 <= 23) {
            $('#nowPlusTwo-time').text(getTimeFormated(now + 2));
            $('#nowPlusTwo-temp').text(`${weatherData.days[0].hours[now + 2].temp}°`);
            $('#nowPlusTwo-precip').text(`${weatherData.days[0].hours[now + 2].precip}%`);
            $('#Weather-icon-fourth-third').attr('src', `../images/${weatherData.days[0].hours[now + 2].icon}.png`);
        } else {
            $('#nowPlusTwo-time').hide();
            $('#nowPlusTwo-temp').hide();
            $('#nowPlusTwo-precip').hide();
            $('#Weather-icon-fourth-third').hide();
        }

        if (now + 3 <= 23) {
            $('#nowPlusThree-time').text(getTimeFormated(now + 3));
            $('#nowPlusThree-temp').text(`${weatherData.days[0].hours[now + 3].temp}°`);
            $('#nowPlusThree-precip').text(`${weatherData.days[0].hours[now + 3].precip}%`);
            $('#Weather-icon-fourth-fourth').attr('src', `../images/${weatherData.days[0].hours[now + 3].icon}.png`);
        } else {
            $('#nowPlusThree-time').hide();
            $('#nowPlusThree-temp').hide();
            $('#nowPlusThree-precip').hide();
            $('#Weather-icon-fourth-fourth').hide();
        }
 
        if (now + 4 <= 23) {
            $('#nowPlusFour-time').text(getTimeFormated(now + 4));
            $('#nowPlusFour-temp').text(`${weatherData.days[0].hours[now + 4].temp}°`);
            $('#nowPlusFour-precip').text(`${weatherData.days[0].hours[now + 4].precip}%`);
            $('#Weather-icon-fourth-fifth').attr('src', `../images/${weatherData.days[0].hours[now + 4].icon}.png`);
        } else {
            $('#nowPlusFour-time').hide();
            $('#nowPlusFour-temp').hide();
            $('#nowPlusFour-precip').hide();
            $('#Weather-icon-fourth-fifth').hide();
        }
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
}
