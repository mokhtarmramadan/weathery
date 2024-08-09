import express from 'express';
import AppController from '../controllers/AppController';
import WeatherController from '../controllers/WeatherController';


function controllerRouting(app) {
  // App controller
  const router = express.Router();
  app.use('/api/v1', router);

  router.get('/status', (req, res) => {
    // Returns ture if redis and mongodb are running otherwise false
    AppController.getStatus(req, res);
  });

  router.get('/weather', (req, res) => {
    // API that sends get requests to the 3rd party API
    WeatherController.getWeather(req, res);
  });

}

export default controllerRouting;
