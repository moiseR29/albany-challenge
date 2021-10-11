import { AlbanyError } from '../../../common';
import { HTTP_STATUS } from '../../../../utils';

export abstract class UserError extends AlbanyError {
  static createError(
    message: string,
    status: number = HTTP_STATUS.BAD_REQUEST,
  ): AlbanyError {
    return new CreateUserError(message, status);
  }

  static LoginError(
    message: string,
    status: number = HTTP_STATUS.BAD_REQUEST,
  ): AlbanyError {
    return new LoginError(message, status);
  }

  static ModifyUserError(
    message: string,
    status: number = HTTP_STATUS.BAD_REQUEST,
  ): AlbanyError {
    return new ModifyUserError(message, status);
  }
}

class CreateUserError extends UserError {
  constructor(message: string, status: number) {
    super('CreateUser', message, status);
  }
}

class LoginError extends UserError {
  constructor(message: string, status: number) {
    super('LoginError', message, status);
  }
}

class ModifyUserError extends UserError {
  constructor(message: string, status: number) {
    super('LoginError', message, status);
  }
}
