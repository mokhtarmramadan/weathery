import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import resolvers from './controllers/WeatherController';
import path from 'path';
import cors from 'cors';
import controllerRouting from './routes/index';
import webpush from 'web-push';

const port = process.env.PORT || 8080;
const app = express();
const publicVapidKey = 'BInQ0ZybZJKZTH-bmT87bHzvB8OG9ADxFB2ujsv37DxqBpMEvP-dEtlnJziWux1bSGSqAbb4BXbRatD1EogV08Y';
const privateVapidKey = 'qL0G7p12XFqmLLso09OgW1-dJmQOCos9qA1Y9LSKXlI';

webpush.setVapidDetails('mailto:mokhtarramdanformal@gmail.com', publicVapidKey, privateVapidKey);

app.use(express.json());

// GraphQL end-point
app.use('/weather', createHandler({
  schema,
  rootValue: resolvers,
}));

// Serving static contentent
app.use(express.static(path.join(__dirname + '/public')));
// Setting CORS policys
app.use(cors());


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/pages/weathery.html");
});

app.get('/hourly', (req, res) => {
  res.sendFile(__dirname + "/public/pages/hourly.html");
});

app.get('/daily', (req, res) => {
  res.sendFile(__dirname + "/public/pages/daily.html");
});

app.get('/notify', (req, res) => {
  res.sendFile(__dirname + "/public/pages/notify.html");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/public/pages/signup.html");
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + "/public/pages/login.html");
});

// Subscribe route
app.post('/subscribe', (req, res) => {
  // Get pushSubcription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({'title': 'push test'});

  // Pass object to sendNotification
  webpush.sendNotification(subscription, payload).catch(err => console.log(err));
});

// Calling the router function
controllerRouting(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;

