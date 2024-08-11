import express from 'express';
import AppController from '../controllers/AppController';
import WeatherController from '../controllers/WeatherController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import PlansController from '../controllers/PlansController';


function controllerRouting(app) {
  // App controller
  const router = express.Router();
  app.use('/api/v1', router);

  router.get('/status', (req, res) => {
    // Returns ture if redis and mongodb are running otherwise false
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    // Returns the number of users and plans in db
    AppController.getStats(req, res);
  });

  router.get('/weather', (req, res) => {
    // API that sends get requests to the 3rd party API
    WeatherController.getWeather(req, res);
  });

  router.post('/users', (req, res) => {
    // API that create a new user
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    // Signs a user in by generating a new authentication token
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    // Sign-out the user based on the token
    AuthController.getDisconnect(req, res);
  });

  router.get('/users/me', (req, res) => {
    // Retrieve the user base on the token used
    UsersController.getMe(req, res);
  });

  router.get('/refresh', (req, res) => {
    // Returns a new accesst token if refresh token was valid
    AuthController.getRefresh(req, res);
  });

  router.get('/plans', (req, res) => {
    // Retrieve all the plan documents
    PlansController.getPlans(req, res);
  });

  router.get('/plans/:id', (req, res) => {
    // Retrieve the plan document based on the ID
    PlansController.getIndex(req, res);
  });

  router.post('/plans', (req, res) => {
    // Creates a plan
    PlansController.newPlan(req, res);
  });

  router.delete('/plans/:id', (req, res) => {
    // Deletes the plan document based on the ID
    PlansController.deletePlan(req, res);
  });

}

export default controllerRouting;
