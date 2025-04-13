import { Router, Request, Response } from 'express';
import { ApiError, InternalError, BadRequestError } from '../core';
import { BadRequestResponse } from '../core/apiresponse';

export const RegisterErrorHandler = (router: Router): void => {
  // Main error handling middleware
  router.use((error: Error, req: Request, res: Response) => {
    handleError(error, res, false);
  });
};

// Define interfaces for the different error types
interface MongoError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

interface CastError extends Error {
  reason: string;
}

interface ValidationErrorObject {
  path: string;
  value: unknown;
  kind: string;
  message: string;
}

interface ValidationError extends Error {
  errors: Record<string, ValidationErrorObject>;
}

const handleError = (error: Error, res: Response, isProduction: boolean): void => {
  if (error instanceof ApiError) {
    ApiError.handle(error, res);
    return;
  }

  const errorHandlers = {
    SyntaxError: handleSyntaxError,
    CastError: handleCastError,
    ValidationError: handleValidationError,
    MongoError: handleMongoError,
    Default: handleDefaultError,
  };

  const handler = errorHandlers[error.name as keyof typeof errorHandlers] || errorHandlers.Default;
  handler(error as CastError & SyntaxError & ValidationError & MongoError & Error, res, isProduction);
};

const handleSyntaxError = (error: SyntaxError, res: Response): void => {
  if (error.message.endsWith('is not valid JSON')) {
    new BadRequestResponse('Invalid JSON body').send(res);
    return;
  }
  handleDefaultError(error, res);
};

const handleCastError = (error: CastError, res: Response, _isProduction?: boolean): void => {
  ApiError.handle(new BadRequestError(`Invalid Id, ${error.reason}`), res);
};

const handleValidationError = (error: ValidationError, res: Response, _isProduction?: boolean): void => {
  const errorMessages = Object.values(error.errors).map((errorObj: ValidationErrorObject) => {
    const errorTypes = {
      Number: `${errorObj.path} must be a number`,
      ObjectId: `${errorObj.value} is not a valid value for the ${errorObj.path} field`,
      required: errorObj.message,
      enum: `${errorObj.value} is not a valid value for ${errorObj.path}`,
    };
    return errorTypes[errorObj.kind as keyof typeof errorTypes] || 'Invalid body!';
  });

  ApiError.handle(new BadRequestError(errorMessages.join(', ')), res);
};

const handleMongoError = (error: MongoError, res: Response, isProduction: boolean): void => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value =
      !isProduction && error.keyValue[field]
        ? typeof error.keyValue[field] === 'object'
          ? ` ${JSON.stringify(error.keyValue[field])}`
          : ` ${error.keyValue[field]}`
        : '';

    ApiError.handle(new BadRequestError(`${field}${value} already exists`), res);
  }
};

const handleDefaultError = (error: Error, res: Response, _isProduction?: boolean): void => {
  const message = error.message || 'Something went wrong';
  ApiError.handle(new InternalError(message), res);
};
