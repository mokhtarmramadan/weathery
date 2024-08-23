import { getTimeInTimeZone } from './dateTimeDistance.js';

export default function queryWeather(query) {
    return new Promise((resolve, reject) => {
        const cashedData = localStorage.getItem(query);
        if (cashedData) {
            const weatherData = JSON.parse(cashedData);
            const time = getTimeInTimeZone(weatherData.timezone);
            const [hours, minutes] = time.split(":");
            const now = Number(hours);
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            if (now <= 23 && formattedDate === weatherData.days[0].datetime) {
                resolve (weatherData);
                console.log("Got from localstorage")
                return;
            }
        }
        localStorage.removeItem(query);
        if (cashedData === null && query === null) {
            resolve(null);
            return;
        }
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
                    return;
                } else {
                    const weatherData = response.data['getWeather'];

                    console.log("Got from ajax")
                    localStorage.setItem(query, JSON.stringify(weatherData));
                    resolve(weatherData);
                    return;
                }
            },
            error: function(error) {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}