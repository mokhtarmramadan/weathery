import { mongodbConnector } from '../utils/db';
const sha1 = require('js-sha1');


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
      return res.status(200).json(newUser);
    }
    return res.status(400).json({'error':'Unexpected error happened during insertion'});
  }
}

export default UsersController;
