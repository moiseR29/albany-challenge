import { App } from './App';
import { DBManager, Psql } from './database';
import { ConfigManager, ENV } from './config';
import { RouterManager } from './core';
import { Images } from './utils';

const main = async () => {
  ConfigManager.define(ENV.DEFAULT);
  Images.configure(__dirname.split('build')[0]);
  const app = App.create();
  DBManager.define(await Psql.create(ConfigManager.get().database));
  app.addRouter(RouterManager.create());
  app.start(ConfigManager.get().server.port);
};

main();
