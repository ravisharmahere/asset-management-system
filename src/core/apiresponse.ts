import { Response } from 'express';
import { HTTP_CODE, STATUS_CODE } from '../constants';
import moment from 'moment';

abstract class ApiResponse {
  constructor(
    protected status_code: STATUS_CODE,
    protected status: HTTP_CODE | number,
    protected message?: string,
    protected timestamp: string = moment().format('DD-MM-YYYY HH:mm:ss')
  ) {}

  protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    // Using type assertion instead of @ts-ignore
    (clone as Record<string, unknown>)['status'] = undefined;
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

abstract class SuccessApiResponse extends ApiResponse {
  constructor(message: string) {
    super(STATUS_CODE.SUCCESS, HTTP_CODE.SUCCESS, message);
  }
}

abstract class FailureApiResponse extends ApiResponse {
  constructor(message: string, status: HTTP_CODE) {
    super(STATUS_CODE.FAILURE, status, message);
  }
}

export class AuthFailureResponse extends FailureApiResponse {
  constructor(message = 'Authentication Failure') {
    super(message, HTTP_CODE.UNAUTHORIZED);
  }
}

export class NotFoundResponse extends FailureApiResponse {
  private url: string | undefined;

  constructor(message = 'Not Found') {
    super(message, HTTP_CODE.NOT_FOUND);
  }

  send(res: Response): Response {
    this.url = res.req?.originalUrl;
    return super.prepare<NotFoundResponse>(res, this);
  }
}

export class ResourceNotFoundResponse extends FailureApiResponse {
  constructor(message = 'Resource not found') {
    super(message, HTTP_CODE.NOT_FOUND);
  }

  send(res: Response): Response {
    return super.prepare<ResourceNotFoundResponse>(res, this);
  }
}

export class NotAcceptableResponse extends FailureApiResponse {
  constructor(message = 'Not Acceptable') {
    super(message, HTTP_CODE.NOT_ACCEPTABLE);
  }

  send(res: Response): Response {
    return super.prepare<NotAcceptableResponse>(res, this);
  }
}

export class SuccessResponse<T> extends SuccessApiResponse {
  constructor(
    message: string,
    private data: T
  ) {
    super(message);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
}

export class PopUpResponse<T> extends ApiResponse {
  constructor(
    message: string,
    private data: T
  ) {
    super(STATUS_CODE.POPUP_STATUS_CODE, HTTP_CODE.SUCCESS, message);
  }
}

export class FailureResponse<T> extends FailureApiResponse {
  constructor(
    message: string,
    private data: T
  ) {
    super(message, HTTP_CODE.BAD_REQUEST);
  }

  send(res: Response): Response {
    return super.prepare<FailureResponse<T>>(res, this);
  }
}

export class NoContentFoundResponse extends ApiResponse {
  constructor() {
    super(STATUS_CODE.SUCCESS, HTTP_CODE.NO_CONTENT_FOUND);
  }

  send(res: Response): Response {
    return super.prepare<NoContentFoundResponse>(res, this);
  }
}

export class ForbiddenResponse extends FailureApiResponse {
  constructor(message = 'Forbidden') {
    super(message, HTTP_CODE.FORBIDDEN);
  }
}

export class BadRequestResponse extends FailureApiResponse {
  constructor(message = 'Bad Parameters') {
    super(message, HTTP_CODE.BAD_REQUEST);
  }
}

export class InternalErrorResponse extends FailureApiResponse {
  constructor(message = 'Internal Error') {
    super(message, HTTP_CODE.INTERNAL_ERROR);
  }
}

export class SuccessMsgResponse extends SuccessApiResponse {
  constructor(message: string) {
    super(message);
  }
}

export class FailureMsgResponse extends FailureApiResponse {
  constructor(message: string) {
    super(message, HTTP_CODE.BAD_REQUEST);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = 'Access token invalid') {
    super(STATUS_CODE.INVALID_ACCESS_TOKEN, HTTP_CODE.UNAUTHORIZED, message);
  }

  send(res: Response): Response {
    return super.prepare<AccessTokenErrorResponse>(res, this);
  }
}

export class TokenRefreshResponse extends SuccessApiResponse {
  constructor(message: string) {
    super(message);
  }

  send(res: Response): Response {
    return super.prepare<TokenRefreshResponse>(res, this);
  }
}

export class TransactionErrorResponse extends FailureApiResponse {
  constructor(message = 'Transaction error') {
    super(message, HTTP_CODE.BAD_REQUEST);
  }

  send(res: Response): Response {
    return super.prepare<TransactionErrorResponse>(res, this);
  }
}

export class AxiosErrorResponse extends FailureApiResponse {
  constructor(statusCode: number, message: string) {
    super(message, statusCode);
  }

  send(res: Response): Response {
    return super.prepare(res, this);
  }
}

export class FileErrorResponse extends FailureApiResponse {
  constructor(message = 'File already exists') {
    super(message, HTTP_CODE.FILE_EXISTS);
  }
}

export class ConflictResponse extends FailureApiResponse {
  constructor(message = 'Conflict') {
    super(message, HTTP_CODE.CONFLICT);
  }

  send(res: Response): Response {
    return super.prepare<ConflictResponse>(res, this);
  }
}

export class UnprocessableEntityResponse extends FailureApiResponse {
  constructor(message = 'UnprocessableEntity') {
    super(message, HTTP_CODE.UNPROCESSABLE_ENTITY);
  }

  send(res: Response): Response {
    return super.prepare<UnprocessableEntityResponse>(res, this);
  }
}
