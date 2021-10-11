import { Router, Request, Response } from 'express';
import { HTTP_STATUS } from '../../utils';
import { UserRouter } from '../user/interface';
import { TicketRouter } from '../ticket/interface';

export class RouterManager {
  private _router: Router;

  constructor() {
    this._router = Router();
  }

  addRoute(route: Router): RouterManager {
    this._router.use('/api', route);
    return this;
  }

  addHealtyEndpoint(func: (req: Request, res: Response) => any): RouterManager {
    this._router.get('/', func);
    return this;
  }

  addErrorEndpoint(): RouterManager {
    this._router.use('*', notFoundEndpoint);
    return this;
  }

  static create(): Router {
    const r = new RouterManager();
    r.addHealtyEndpoint(healty)
      .addRoute(UserRouter.create())
      .addRoute(TicketRouter.create())
      .addErrorEndpoint();
    return r._router;
  }
}

const healty = (req: Request, res: Response) => {
  return res.status(HTTP_STATUS.OK).json({ message: 'Welcome to Albany Api' });
};

const notFoundEndpoint = (req: Request, res: Response) => {
  return res
    .status(HTTP_STATUS.BAD_REQUEST)
    .json({ message: 'endpoint not exists' });
};
