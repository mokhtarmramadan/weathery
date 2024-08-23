import { redisConnector } from '../utils/redis';
import { mongodbConnector } from '../utils/db';
const sha1 = require('js-sha1');
import { ObjectId } from 'mongodb';


class UsersController {
  
  static async postNew(req, res) {
    // userName, email, pass
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password

    if (!userName) {
      return res.status(400).json({'error':'Missing userName'});
    }
    if (!password) {
      return res.status(400).json({'error':'Missing password'});
    }
    if (!email) {
      return res.status(400).json({'error':'Missing email'});
    }
    try {
      const dbClient = await mongodbConnector();
      const usersCollection = await dbClient.db.collection('users');
      const user = await usersCollection.findOne({'email': email});

      if (user) {
        return res.status(400).json({'error':'Already exists'});
      }

      const hashedPassword = sha1(password);

      const newUser = {
        userName,
        password: hashedPassword,
        email,
      };

      const InsertOneResult = await usersCollection.insertOne(newUser);
      if (InsertOneResult.insertedId) {
        return res.status(201).json({});
      }

    } catch (err) {
      console.error('Unexpected error happened during insertion:', err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static async getUsers(req, res) {
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
      const users = await userCollection.find({}).toArray();
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if(!token) {
      return res.status(401).json({'error':'Unauthorized'});
    }

    try {
      const redisClient = await redisConnector();
      const userId = await redisClient.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({'error':'Unauthorized'});
      }

      const dbClient = await mongodbConnector();
      const usersCollection = await dbClient.db.collection('users');
      const user = await usersCollection.findOne({'_id': new ObjectId(userId)});

      return res.status(200).json({'userName':user.userName, 'email':user.email, 'id':user._id});

    } catch (err) {
      console.error('Error looking up database:', err);
      return res.status(500).json({'error':'Internal server error'});
    }
  }

}

export default UsersController;
