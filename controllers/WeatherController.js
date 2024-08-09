import axios from 'axios';
import fs from 'fs';


class WeatherController {

  static async getWeather(req, res) {
    try {
      const query = req.query.find;
      const [ startDate, endDate ] = this.getDate();
      console.log(startDate, endDate);
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}/${startDate}/${endDate}?unitGroup=us&key=ERH9E869B5K8ZYTRVK9QZ66Q5&contentType=json`;

      const response = await axios.get(url);
      const days = response.data['days'];
      console.log(days.length);
      const temDayOne = response.data['days'][0]['tempmax'];
      try {
        fs.writeFileSync(`tempData/${query}`, JSON.stringify(response.data, null, 4));
      } catch (err) {
        console.error('Error writing a file', err);
      }
      return res.status(200).json(temDayOne);
    } catch (err) {
      console.error('Error Requesting 3rd Party API:', err);
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
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
