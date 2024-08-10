import { redisConnector } from '../utils/redis';
import { mongodbConnector } from '../utils/db';


class AppController {

  static async getStatus(req, res) {
    const redisClient = await redisConnector();
    const dbClient = await mongodbConnector(); 
    return res.status(200).json({'redis':redisClient.isAlive(), 'mongodb':dbClient.isAlive()});
  }

  static async getStats(req, res) {
    const dbClient = await mongodbConnector();
    const usersCount = await dbClient.nbUsers();
    const plansCount = await dbClient.nbPlans();
    return res.status(200).json({'users':usersCount, 'plans':plansCount});
  }
}

export default AppController;
