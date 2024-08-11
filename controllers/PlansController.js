import { mongodbConnector } from '../utils/db';
import { redisConnector } from '../utils/redis';


class PlansController {
  
  static async getPlans(req, res) {
    return res.send("getPlans");
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
