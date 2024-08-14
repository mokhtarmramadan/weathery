import axios from 'axios';
import fs from 'fs';
import { redisConnector } from '../utils/redis';


class Weather {

  static async getAPI(query) {
    try {
      const [ startDate, endDate ] = this.getDate();
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}/${startDate}/${endDate}?unitGroup=us&key=ERH9E869B5K8ZYTRVK9QZ66Q5&contentType=json`;
      let response = await axios.get(url);
      response = response.data;

      try {
	const fileName = query.toLowerCase();
        const filePath = `tempData/${fileName}`;
	const data = {
	  "resolvedAddress": response.resolvedAddress,
	  "timezone": response.timezone,
	  "description": response.description,
	  "days": response.days.map(day => ({
            "datetime": day.datetime,
	    "tempmax": day.tempmax,
            "tempmin": day.tempmin,
            "feelslike": day.feelslike,
	    "humidity": day .humidity,
	    "icon": day.icon,
	    "description": day.description,
	    "sunset": day.sunset,
	    "sunrise": day.sunrise,
	    "uvindex": day.uvindex,
	    "visibility": day.visibility,
	    "precip": day.precip,
	    "hours": day.hours.map(hour => ({
	      "datetime": hour.datetime,
	      "temp": hour.temp,
	      "feelslike": hour.feelslike,
	      "humidity": hour.humidity,
	      "precip": hour.precip,
	      "visibility": hour.visibility,
	      "uvindex": hour.uvindex,
	      "icon": hour.icon,
	    }))
          }))
	}
        
	fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        const redisClient = await redisConnector();
        await redisClient.set(fileName, filePath);

	return [data, filePath];

      } catch (err) {
        console.error('Error writing a file:', err);
        return [500, {'error':'Internal server error'}];
      }

    } catch (err) {
      console.error('Error Requesting 3rd Party API:', err);
      return [500, {'error':"Can't find address try again"}];
    }
  }

  static readFileSync(filePath) {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r'});
    data = JSON.parse(data);
    return data;
  }

  static getDate() {
    const today = new Date();
    const later = new Date(today);
    later.setDate(today.getDate() + 6);

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');

    const startDate = `${year}-${month}-${day}`;
    year = later.getFullYear();
    month = String(later.getMonth() + 1).padStart(2, '0');
    day = String(later.getDate()).padStart(2, '0');

    const endDate = `${year}-${month}-${day}`;
    return [startDate, endDate];
  }

}

export default Weather;
