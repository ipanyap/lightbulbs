import { Request, Response, Router } from 'express';
import { router as bulb_router } from './bulb';

export const router = Router();

router.use('/bulb', bulb_router);

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello World! I am API server');
});
