import express, { Express, Request, Response } from 'express';

const PORT = 3000;

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World! I am API server');
});

app.listen(PORT, () => {
  console.log('Server is running at port', PORT);
});
