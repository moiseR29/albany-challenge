import { HTTP_STATUS } from '../../utils';

interface ErrorResponse {
  status: number;
  error: string;
  source: string;
}

export abstract class AlbanyError extends Error {
  private _source: string;
  private _status: number;

  constructor(
    source: string,
    message: string,
    status: number = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(message);
    this._source = source;
    this._status = status;
    this.name = this.constructor.name;
  }

  get status(): number {
    return this._status;
  }

  get error(): ErrorResponse {
    return {
      status: this._status,
      error: this.message,
      source: this._source,
    };
  }

  static GenericError(message: string): AlbanyError {
    return new GenericError(message);
  }

  static DBError(message: string): AlbanyError {
    return new DBError(message);
  }

  static TokenError(message: string): AlbanyError {
    return new TokenError(message);
  }

  static ValidateError(message: string): AlbanyError {
    return new ValidateError(message);
  }

  static isAlbanyError(err: Error | AlbanyError): boolean {
    return err instanceof AlbanyError;
  }

  static getError(err: Error | AlbanyError): AlbanyError {
    if (!AlbanyError.isAlbanyError(err)) {
      return AlbanyError.GenericError(err.message);
    }

    return err as AlbanyError;
  }
}

class GenericError extends AlbanyError {
  constructor(message: string) {
    super('Generic', message, HTTP_STATUS.BAD_REQUEST);
  }
}

class DBError extends AlbanyError {
  constructor(message: string) {
    super('DB ERROR', message, HTTP_STATUS.SERVER_INTERNAL_ERROR);
  }
}

class ValidateError extends AlbanyError {
  constructor(message: string) {
    super('Validate Error', message, HTTP_STATUS.NOT_ACCEPTABLE);
  }
}

class TokenError extends AlbanyError {
  constructor(message: string) {
    super('Token Error', message, HTTP_STATUS.UNAUTHORIZED);
  }
}
