import { mongodbConnector } from '../utils/db';
import { redisConnector } from '../utils/redis';
import { ObjectId } from 'mongodb';


class PlansController {
  
  static async getPlans(req, res) {
    const token = req.headers['x-token'];
    const redisClient = await redisConnector();
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) {
      return res.status(401).json({'error':'Unauthorized'});
    }
    try {
      const dbClient = await mongodbConnector();
      const userCollection = await dbClient.db.collection('users');
      const user = await userCollection.findOne({'_id': new ObjectId(userId), 'email': 'mokhtarramdanformal@gmail.com'});

      if (!user) {
        return res.status(401).json({'error':'Unauthorized'});
      }
      const plansCollection = await dbClient.db.collection('plans');
      const plans = await plansCollection.find({}).toArray();
      return res.status(200).json(plans);
    } catch (err) {
      console.log(err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static async getIndex(req, res) {
    return res.send("getIndex");
  }

  static async newPlan(req, res) {
    return res.send("newPlan");
  }

  static async updatePlan(req, res) {
    return res.send("updatePlan");
  }

  static async deletePlan(req, res) {
    return res.send("deletePlan");
  }
}

export default PlansController;
