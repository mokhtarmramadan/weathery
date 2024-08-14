import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './graphql/schema';
import resolvers from './controllers/WeatherController';

const port = process.env.PORT || 8080;
const app = express();

// GraphQL end-point
app.use('/weather', createHandler({
  schema,
  rootValue: resolvers,
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;

