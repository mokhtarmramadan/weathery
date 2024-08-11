import { redisConnector } from '../utils/redis';
import Weather from '../utils/weather';


class WeatherController {

  static async getWeather(req, res) {
    const query = req.query.find;
    const redisClient = await redisConnector();
    const filePath = await redisClient.get(query.toLowerCase());
    if (filePath) {
      const weatherData = Weather.readFileSync(filePath);
      return res.status(200).json(weatherData);
    }
    const [weatherData, newFilePath] = await Weather.getAPI(query);
    if (weatherData === 500) {
      // In case of error weatherData will carry 500 newFilePath will
      // carry the error message
      return res.status(500).json(newFilePath);
    }
    redisClient.set(query, newFilePath);
    return res.status(200).json(weatherData);
  }


}

export default WeatherController;
