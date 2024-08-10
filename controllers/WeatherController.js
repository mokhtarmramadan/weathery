import axios from 'axios';
import fs from 'fs';
import { redisConnector } from '../utils/redis';


class WeatherController {

  static async getWeather(req, res) {
    const query = req.query.find;
    const filePath = await this.getAPI(query);
    this.readFileSync(filePath);
    return res.send();
  }

  static async getAPI(query) {
    try {
      const [ startDate, endDate ] = this.getDate();
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}/${startDate}/${endDate}?unitGroup=us&key=ERH9E869B5K8ZYTRVK9QZ66Q5&contentType=json`;
      let response = await axios.get(url);
      response = response.data;

      try {
	const filePath = `tempData/${query}`;
        fs.writeFileSync(filePath, JSON.stringify(response, null, 4));
        const redisClient = await redisConnector();
	await redisClient.set(query, filePath);
	return filePath;

      } catch (err) {
        console.error('Error writing a file:', err);
	return res.status(500).json({'error':'Internal server error'});
      }

    } catch (err) {
      console.error('Error Requesting 3rd Party API:', err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static readFileSync(filePath) {
    let data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r'});
    data = JSON.parse(data);
    console.log(data['days']);
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

export default WeatherController;
