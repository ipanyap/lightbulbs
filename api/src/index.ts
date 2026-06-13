import express, { Express, NextFunction, Request, Response } from 'express';
import { AppError, AppErrorCode } from '@lightbulbs/common';
import { getDatabaseClient } from './common/db';
import { formatHTTPFailedResponse, getHTTPStatusCode } from './common/route/response';
import { router } from './routes';

const PORT = 3000;

(async () => {
  // Initialize database connection.
  await getDatabaseClient().connect();

  const app: Express = express();

  app.use(express.json());

  app.use('/', router);

  // Invalid URL handling
  app.use((req: Request, res: Response) => {
    console.error(`URL ${req.path} not found!`);

    // Ensure the error is standardized.
    const app_error = new AppError({
      code: AppErrorCode.INPUT,
      name: 'InvalidURL',
      message: 'The URL for this resource is not found.',
    });

    // Format and send the response.
    res.status(404).json(formatHTTPFailedResponse(app_error));
  });

  // Default error handling
  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);

    // Ensure the error is standardized.
    const app_error =
      error instanceof AppError
        ? error
        : new AppError({
            code: AppErrorCode.UNKNOWN,
            name: 'AppError',
            message: 'A problem has occurred.',
          });

    // Derive the right HTTP status code.
    const http_status_code = getHTTPStatusCode(app_error);

    // Format and send the response.
    res.status(http_status_code).json(formatHTTPFailedResponse(app_error));
  });

  app.listen(PORT, () => {
    console.log('Server is running at port', PORT);
  });
})();
