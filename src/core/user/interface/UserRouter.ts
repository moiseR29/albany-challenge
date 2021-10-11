import { Router } from 'express';
import { UserController } from './UserController';
import { ROUTE_METHOD, CommonMiddlewares } from '../../common';
import { AlbanyRouter } from '../../common/AlbanyRouter';

export class UserRouter extends AlbanyRouter {
  constructor() {
    super('User Router');
  }

  static create(): Router {
    const c = new UserController();
    const r = new UserRouter();
    r.addRoute('/user', c.createUser(), ROUTE_METHOD.POST)
      .addRoute('/login', c.login(), ROUTE_METHOD.POST)
      .addRoute('/user', c.modifyUser(), ROUTE_METHOD.PUT, [
        CommonMiddlewares.needToken(),
      ]);
    return r.router;
  }
}
