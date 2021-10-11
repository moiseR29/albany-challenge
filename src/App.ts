import express, { Application, Router, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Logger } from './utils';

export class App {
  private _app: Application;
  private _log: Logger;

  constructor() {
    this._app = express();
    this._log = new Logger('APP');
  }

  addMiddleware(name: string, func: any): App {
    this.log.info(`Apply ${name} middleware`);
    this.app.use(func);
    return this;
  }

  addRouter(router: Router): App {
    this.app.use(router);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async start(port: number, func: () => void = () => {}): Promise<void> {
    this.app.listen(port, () => {
      this.log.info(`Server running on port ${port}`);
      func();
    });
  }

  private get app(): Application {
    return this._app;
  }

  private get log(): Logger {
    return this._log;
  }

  static create(): App {
    const app = new App();
    return app
      .addMiddleware(
        'cors',
        cors({
          allowedHeaders: ['Origin'],
          origin: '*',
          methods: 'GET,OPTIONS,PUT,POST,DELETE',
        }),
      )
      .addMiddleware('helmet', helmet())
      .addMiddleware('json', json())
      .addMiddleware('url encoded', urlencoded({ extended: true }));
  }
}
