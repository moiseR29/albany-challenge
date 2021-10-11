/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import { CreateUser, Login, ModifyUser } from '../business';
import { UserDAOPsql } from './UserDAOPsql';
import { AlbanyError } from '../../common';
import { HTTP_STATUS, ALBANY_TOKEN } from '../../../utils';

export class UserController {
  createUser(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await CreateUser(req.body, new UserDAOPsql());
        return res.status(HTTP_STATUS.CREATED).send(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  login(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await Login(req.body, new UserDAOPsql());
        res.setHeader(ALBANY_TOKEN, response);
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: 'Login Successfully' });
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }

  modifyUser(): any {
    return async (req: Request, res: Response) => {
      try {
        const response = await ModifyUser(
          req.body,
          req.get(ALBANY_TOKEN)!,
          new UserDAOPsql(),
        );
        return res.status(HTTP_STATUS.OK).json(response);
      } catch (error) {
        // @ts-ignore
        const parse = AlbanyError.getError(error);
        return res.status(parse.error.status).json(parse.error);
      }
    };
  }
}
