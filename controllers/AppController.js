import { redisConnector } from '../utils/redis';


class AppController {

  static async getStatus(req, res) {
    const redisClient = await redisConnector();
    return res.status(200).json({'redis':redisClient.isAlive()});
  }
}

export default AppController;
