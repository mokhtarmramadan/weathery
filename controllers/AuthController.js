import { mongodbConnector } from '../utils/db';
import { redisConnector } from '../utils/redis';
const sha1 = require('js-sha1');
import { v4 as uuidv4 } from 'uuid';


class AuthController {

  static async getConnect(req, res) {
    const authorization = req.headers['authorization'];
    
    if (!authorization) {
      return res.status(400).json({'error':'Missing authorization header'});
    }

    const [type, code] = authorization.split(" ");
    const decodedString = Buffer.from(code, 'base64').toString('utf-8');
    const [email, password] = decodedString.split(":");
    const hashedPassword = sha1(password);
    
    try {
      const dbClient = await mongodbConnector();
      const usersCollection = await dbClient.db.collection('users');
      const user = await usersCollection.findOne({'email':email, 'password':hashedPassword})

      if (!user) {
        return res.status(401).json({'error':'Authorization'})
      }

      try {
        const xToken = uuidv4();
        const accessToken = `auth_${xToken}`;
	const yToken = uuidv4();
	const refreshToken = `ref_${yToken}`;
        const redisClient =  await redisConnector();
        await redisClient.set(accessToken, user._id.toString(), 900);
	await redisClient.set(refreshToken, user._id.toString(), 1296000);
        return res.status(200).json({"accessToken": xToken, "refreshToken": yToken});

      } catch(err) {
        console.error('Error setting token in redis:', err);
        return res.status(500).json({'error':'Internal server error'});
      }
    } catch(err) {
      console.error('Error looking up database:', err);
      return res.status(500).json({'error':'Internal server error'});

    }
  }
   
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({'error':'Unauthorized'});
    }

    try {
      const redisClient = await redisConnector();
      const user = await redisClient.get(`auth_${token}`);

      if (!user) {
        return res.status(401).json({'error':'Unauthorized'});
      }
      await redisClient.del(`auth_${token}`);
      return res.status(204).send();
    } catch (err) {
      console.error('Error operating on redisClient:', err);
      return res.status(500).json({'error':'Internal server error'});
    }

  }

  static async getRefresh(req, res) {
    const yToken = req.headers['y-token'];
    if (!yToken) {
      return res.status(401).json({'error':'Unauthorized'});
    }

    const refreshToken = `ref_${yToken}`;

    try {
      const redisClient = await redisConnector();
      const userId = await redisClient.get(refreshToken);

      if (!userId) {
        return res.status(401).json({'error':'Unauthorized'});
      }

      const xToken = uuidv4();
      const accessToken = `auth_${xToken}`;
      await redisClient.set(accessToken, userId, 900);
      return res.status(201).json({'accessToken': xToken});
  } catch (err) {
    console.log('Error genrating access token', err);
    return res.status(500).json({'error':'Internal server error'});
   }

  }
}


export default AuthController;


















