import express from 'express';
import controllerRouting from './routes/index';

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());

controllerRouting(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
