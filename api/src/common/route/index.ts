import { NextFunction, Request, Response, Router } from 'express';
import { formatHTTPSuccessResponse } from './response';
import { HTTPMethod, IRouteController, IWorkflowInput } from './types';
import { getValidator } from './validator';

/**
 * Register a controller into a router.
 * @param router The Express router to host the controller.
 * @param controller The controller configuration.
 */
export function buildRoute<InputType extends IWorkflowInput>(
  router: Router,
  controller: IRouteController<InputType>
): void {
  const { method, path, schema, workflow } = controller;

  // If input schema is provided, generate an input validator from the shema.
  const validator = schema ? getValidator(schema) : undefined;

  // HTTP status code for success: 201 if a POST route, 200 otherwise
  const http_success_code = method === HTTPMethod.POST ? 201 : 200;

  // Compose the middlewares: validator and request handler
  const middlewares = [
    ...(validator ? [validator] : []),
    async (req: Request, res: Response, next: NextFunction) => {
      // Extract the input from the request
      const input = {
        ...(req.params ? { key: req.params } : {}),
        ...(req.query ? { options: req.query } : {}),
        ...(req.body ? { data: req.body } : {}),
      } as InputType;

      // Perform the workflow and return the formatted result
      try {
        const result = await workflow(input);

        res.status(http_success_code).json(formatHTTPSuccessResponse(result));
      } catch (e) {
        // If there is any error, pass it to the error handler
        next(e);
      }
    },
  ];

  // Register the middlewares to the destined path and method
  if (method === HTTPMethod.GET) {
    router.get(path, middlewares);
  } else if (method === HTTPMethod.POST) {
    router.post(path, middlewares);
  } else if (method === HTTPMethod.PUT) {
    router.put(path, middlewares);
  } else if (method === HTTPMethod.PATCH) {
    router.patch(path, middlewares);
  }
}
