import { Router } from 'express';
import { Logger } from '../../utils';

export enum ROUTE_METHOD {
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  GET = 'get',
  PATCH = 'patch',
  USE = 'use',
}

type METHOD =
  | ROUTE_METHOD.POST
  | ROUTE_METHOD.PUT
  | ROUTE_METHOD.DELETE
  | ROUTE_METHOD.GET
  | ROUTE_METHOD.PATCH
  | ROUTE_METHOD.USE;

export abstract class AlbanyRouter {
  private _router: Router;
  private _logger: Logger;

  constructor(name: string) {
    this._logger = new Logger(name);
    this._router = Router();
  }

  protected get router(): Router {
    return this._router;
  }

  protected get log(): Logger {
    return this._logger;
  }

  addRoute(
    path: string,
    func: any,
    method: METHOD = ROUTE_METHOD.GET,
    midds: Array<any> = [],
  ): AlbanyRouter {
    this._logger.info(`Adding -> ${path}`);
    switch (method) {
      case ROUTE_METHOD.POST:
        this.router.post(path, midds, func);
        break;
      case ROUTE_METHOD.PATCH:
        this.router.patch(path, midds, func);
        break;
      case ROUTE_METHOD.GET:
        this.router.get(path, midds, func);
        break;
      case ROUTE_METHOD.DELETE:
        this.router.delete(path, midds, func);
        break;
      case ROUTE_METHOD.PUT:
        this.router.put(path, midds, func);
        break;
      case ROUTE_METHOD.USE:
        this.router.use(func);
        break;
    }
    return this;
  }
}
