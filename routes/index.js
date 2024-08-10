import express from 'express';
import AppController from '../controllers/AppController';
import WeatherController from '../controllers/WeatherController';
import UsersController from '../controllers/UsersController';


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

}

export default controllerRouting;
