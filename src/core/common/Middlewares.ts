/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, NextFunction } from 'express';
import {
  ALBANY_TOKEN,
  CryptManager,
  HTTP_STATUS,
  TYPE_USER,
} from '../../utils';
import { AlbanyError } from './Error';

const hasToken = (req: Request): string => {
  const token = req.get(ALBANY_TOKEN);
  if (!token) throw AlbanyError.TokenError('You need Token');
  return token;
};

class CommonMiddlewares {
  needToken() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        hasToken(req);
        next();
      } catch (error) {
        // @ts-ignore
        const err = AlbanyError.getError(error);
        return res.status(err.status).send(err.error);
      }
    };
  }

  onlyClient() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const tokenData = CryptManager.jwt.verifyToken(hasToken(req));

        if (tokenData.type !== TYPE_USER.CLIENT)
          return res
            .status(HTTP_STATUS.UNAUTHORIZED)
            .json({ message: 'You don´t have permission' });

        return next();
      } catch (error) {
        // @ts-ignore
        const err = AlbanyError.getError(error);
        return res.status(err.status).send(err.error);
      }
    };
  }

  onlyTechnical() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const tokenData = CryptManager.jwt.verifyToken(hasToken(req));

        if (tokenData.type !== TYPE_USER.TECHNICAL)
          return res
            .status(HTTP_STATUS.UNAUTHORIZED)
            .json({ message: 'You don´t have permission' });

        return next();
      } catch (error) {
        // @ts-ignore
        const err = AlbanyError.getError(error);
        return res.status(err.status).send(err.error);
      }
    };
  }
}

const i: CommonMiddlewares = new CommonMiddlewares();
export { i as CommonMiddlewares };
