import { redisConnector } from '../utils/redis';
import Weather from '../utils/weather';

const resolvers = {
  async getWeather({ placeLocation }) {
    try {
      console.log("Fetching weather for:", placeLocation);
      const query = placeLocation;
      const redisClient = await redisConnector();
      const filePath = await redisClient.get(query.toLowerCase());

      if (filePath) {
        console.log("Weather data from Redis");
        const weatherData = Weather.readFileSync(filePath);
        return weatherData;
      }

      const [weatherData, newFilePath] = await Weather.getAPI(query);
      console.log("Weather data from API:");
      if (weatherData === 500) {
        console.error("Error fetching weather data:", newFilePath);
        throw new Error(newFilePath);  // Throw an error to be caught by GraphQL
      }

      await redisClient.set(query, newFilePath);
      return weatherData;
    } catch (error) {
      console.error("Error in getWeather resolver:", error.message);
      throw new Error(`Error fetching weather data: ${error.message}`);
    }
  },
};

export default resolvers;
