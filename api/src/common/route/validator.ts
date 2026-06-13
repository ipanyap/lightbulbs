import AJV, { ErrorObject } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@lightbulbs/common';
import { formatHTTPFailedResponse } from './response';
import { IWorkflowInput, IWorkflowJSONSchema } from './types';

/**
 * Configure AJV behavior for request input validator.
 */
const ajv = new AJV({
  // Return immediately once the first error is found.
  allErrors: false,
  // Cast the data value to match the defined type.
  coerceTypes: true,
  // Replace missing properties with default values.
  useDefaults: true,
});

/**
 * The factory function that generates a validation middleware from the provided schema.
 * @param schema The schema to validate the input against.
 * @returns The validation middleware.
 */
export function getValidator<T extends IWorkflowInput>(
  schema: IWorkflowJSONSchema<T>
): (req: Request, res: Response, next: NextFunction) => void {
  const validateKey = schema.key ? ajv.compile(schema.key) : null;
  const validateData = schema.data ? ajv.compile(schema.data) : null;
  const validateOptions = schema.options ? ajv.compile(schema.options) : null;

  // Generate and return the middleware.
  return (req: Request, res: Response, next: NextFunction) => {
    let message_segments: Array<string> = [];
    let validation_error: ErrorObject | null = null;

    /**
     * Validate the input, and auto-match the values when possible.
     */
    if (validateKey && !validateKey(req.params) && validateKey.errors) {
      message_segments.push('Path:');
      validation_error = validateKey.errors[0];
    } else if (validateData && !validateData(req.body) && validateData.errors) {
      message_segments.push('Body:');
      validation_error = validateData.errors[0];
    } else if (validateOptions && !validateOptions(req.query) && validateOptions.errors) {
      message_segments.push('Query:');
      validation_error = validateOptions.errors[0];
    }

    /**
     * If all validation passes, forward to the next middleware.
     */
    if (validation_error === null) {
      return next();
    }

    /**
     * If there are validation errors, return Bad Request error.
     */
    const { instancePath, message, params } = validation_error;

    const name = params.missingProperty ? 'MissingInput' : 'InvalidInput';
    const property = instancePath.slice(1);

    if (property.length > 0) {
      message_segments.push(property);
    }

    if (message) {
      message_segments.push(message);
    }

    const error = new AppError({
      name,
      message: message_segments.join(' '),
    });

    res.status(400).json(formatHTTPFailedResponse(error));
  };
}
