import { Request, Response, NextFunction } from 'express';

export const ALBANY_TOKEN = 'albany-token';

export type HTTPFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 408,
  SERVER_INTERNAL_ERROR = 500,
}

export enum TYPE_USER {
  CLIENT = 'C',
  TECHNICAL = 'T',
}

export enum TICKET_GET_METHOD {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SOLVED = 'solved',
  UNSOLVED = 'unsolved',
}
