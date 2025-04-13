// error.ts
import { Response } from 'express';
import { logger } from './logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export enum ErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, ErrorCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden action') {
    super(message, ErrorCode.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, ErrorCode.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, ErrorCode.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation error') {
    super(message, ErrorCode.VALIDATION_ERROR);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR);
  }
}

export const errorHandler = (error: Error, res: Response) => {
  if (error instanceof AppError && error.isOperational) {
    logger.warn(`Operational error: ${error.message}`, { stack: error.stack });

    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Programming or other unknown error
  logger.error(`Unhandled error: ${error.message}`, { stack: error.stack });

  return res.status(ErrorCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Something went wrong, please try again later.',
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
      errorHandler(error, res);
    });
  };
};
