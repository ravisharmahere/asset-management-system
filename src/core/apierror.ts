import { Response } from 'express';
import {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
  ResourceNotFoundResponse,
  NotAcceptableResponse,
  ConflictResponse,
  UnprocessableEntityResponse,
} from './apiresponse';
import { ERROR_TYPE } from './../constants/error.enum';

export abstract class ApiError extends Error {
  constructor(
    public type: ERROR_TYPE,
    public message: string = 'error'
  ) {
    super(message);
  }

  public static handle(err: ApiError, res: Response): Response {
    const message = err.message;

    switch (err.type) {
      case ERROR_TYPE.BAD_TOKEN:
      case ERROR_TYPE.TOKEN_EXPIRED:
      case ERROR_TYPE.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);
      case ERROR_TYPE.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message).send(res);
      case ERROR_TYPE.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);
      case ERROR_TYPE.NOT_FOUND:
      case ERROR_TYPE.NO_ENTRY:
      case ERROR_TYPE.NO_DATA:
        return new NotFoundResponse(err.message).send(res);
      case ERROR_TYPE.NOT_ACCEPTABLE:
        return new NotAcceptableResponse(err.message).send(res);
      case ERROR_TYPE.BAD_REQUEST:
      case ERROR_TYPE.RESOURCE_EXISTS:
      case ERROR_TYPE.TRANSACTION_ERROR:
        return new BadRequestResponse(err.message).send(res);
      case ERROR_TYPE.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      case ERROR_TYPE.RESOURCE_NOT_EXISTS:
        return new ResourceNotFoundResponse(err.message).send(res);
      case ERROR_TYPE.CONFLICT:
        return new ConflictResponse(err.message).send(res);
      case ERROR_TYPE.UNPROCESSABLE_ENTITY:
        return new UnprocessableEntityResponse(err.message).send(res);
      default:
        return new InternalErrorResponse(message).send(res);
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Authorization failure') {
    super(ERROR_TYPE.AUTH_FAILURE, message);
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(message = 'Not Authorized') {
    super(ERROR_TYPE.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(ERROR_TYPE.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(ERROR_TYPE.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(ERROR_TYPE.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(ERROR_TYPE.FORBIDDEN, message);
  }
}

export class NotAcceptableError extends ApiError {
  constructor(message = 'Not Acceptable') {
    super(ERROR_TYPE.NOT_ACCEPTABLE, message);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry doesn't exist") {
    super(ERROR_TYPE.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(ERROR_TYPE.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired') {
    super(ERROR_TYPE.TOKEN_EXPIRED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(ERROR_TYPE.NO_DATA, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(ERROR_TYPE.ACCESS_TOKEN, message);
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(resource: string) {
    super(ERROR_TYPE.RESOURCE_NOT_EXISTS, `${resource} not found`);
  }
}

export class ResourceFoundError extends ApiError {
  constructor(message: string) {
    super(ERROR_TYPE.RESOURCE_EXISTS, message);
  }
}

export class TransactionError extends ApiError {
  constructor(message = 'Transaction Error') {
    super(ERROR_TYPE.TRANSACTION_ERROR, message);
  }
}

export class NotificationError extends ApiError {
  constructor(message = 'Notification Error') {
    super(ERROR_TYPE.NOTIFICATION_ERROR, message);
  }
}

export class FileError extends ApiError {
  constructor(type: ERROR_TYPE.FILE_EXISTS | ERROR_TYPE.FILE_NOT_EXISTS, message: string) {
    super(type, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(ERROR_TYPE.CONFLICT, message);
  }
}

export class UnprocessableEntityError extends ApiError {
  constructor(message = 'Unprocessable Entity') {
    super(ERROR_TYPE.UNPROCESSABLE_ENTITY, message);
  }
}
