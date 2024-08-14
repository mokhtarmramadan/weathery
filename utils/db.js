import { MongoClient } from 'mongodb';


class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'weathery';
  }

  async connect() {
    try {
      this.url =  `mongodb://${this.host}:${this.port}`;
      this.client = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
      this.db = this.client.db(this.database);
    } catch(err) {
      console.error('Error Connecting to Mongodb:', err);
    }
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.isAlive()) {
      console.error('Database is not connected');
    }
    const usersCollection = this.db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    return usersCount;
  }

  async nbPlans() {
    if (!this.isAlive()) {
      console.error('Database is not connected');
    }
    const plansCollection = this.db.collection('plans');
    const plansCount = await plansCollection.countDocuments();
    return plansCount;
  }

}


async function mongodbConnector() {
  const dbClient = new DBClient();
  await dbClient.connect();
  return dbClient;
}

export { mongodbConnector };
