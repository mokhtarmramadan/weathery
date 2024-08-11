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
    const token = req.headers['x-token'];
    const planId = req.params.id;
    const redisClient = await redisConnector();
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({'error':'Unauthorized'});
    }
    try {
      const dbClient = await mongodbConnector();
      const plansCollection = await dbClient.db.collection('plans');

      if (!ObjectId.isValid(planId)) {
        return res.status(400).json({'error':'Invalid plan id'});
      }
      const plan = await plansCollection.findOne({'_id': new ObjectId(planId), 'userId': userId});

      if (!plan) {
        return res.status(404).json({'error':'Not found'});
      }
      return res.status(200).json(plan);
    } catch (err) {
      console.error(err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static async postNew(req, res) {
    const token = req.headers['x-token'];
    const { planLocation, time } = req.body;

    if (!planLocation) {
      return res.status(400).json({'error':'Missing planLocation'});
    }
    if (!time) {
      return res.status(400).json({'error':'Missing time'});
    }
    const redisClient = await redisConnector();
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({'error':'Unauthorized'});
    }
    try {
      const dbClient = await mongodbConnector();
      const plansCollection = await dbClient.db.collection('plans');
      const newPlan = {
	userId,
	time,
        planLocation,
      }
      const InsertOneResult = await plansCollection.insertOne(newPlan);
      if (InsertOneResult.insertedId) {
        return res.status(201).json(newPlan);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static async deletePlan(req, res) {
    const token = req.headers['x-token'];
    const planId = req.params.id;
    const redisClient = await redisConnector();
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({'error':'Unauthorized'});
    }
    try {
      const dbClient = await mongodbConnector();
      const plansCollection = await dbClient.db.collection('plans');

      if (!ObjectId.isValid(planId)) {
        return res.status(400).json({'error':'Invalid plan id'});
      }
      const plan = await plansCollection.findOne({'_id': new ObjectId(planId), 'userId': userId});

      if (!plan) {
        return res.status(404).json({'error':'Not found'});
      }
      await plansCollection.deleteOne({ '_id': new ObjectId(planId), 'userId': userId});
      return res.status(200).json({});
    } catch (err) {
      console.error(err);
      return res.status(500).json({'error':'Internal server error'});
    }

  }
}

export default PlansController;
