import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import resolvers from './controllers/WeatherController';
import path from 'path';
import cors from 'cors';
import controllerRouting from './routes/index';


const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
// GraphQL end-point
app.use('/weather', createHandler({
  schema,
  rootValue: resolvers,
}));

app.use(express.static(path.join(__dirname + '/public')));
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
controllerRouting(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export default app;

