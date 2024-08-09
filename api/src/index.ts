import express, { Express, Request, Response } from 'express';
import { getDatabaseClient } from './common/db';

const PORT = 3000;

(async () => {
  // Initialize database connection.
  await getDatabaseClient().connect();

  const app: Express = express();

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World! I am API server');
  });

  app.listen(PORT, () => {
    console.log('Server is running at port', PORT);
  });
})();
