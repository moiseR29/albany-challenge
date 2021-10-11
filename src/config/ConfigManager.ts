import { Config } from './Config';
import { DefaultConfig, TestConfig } from './ConfigEnv';

export enum ENV {
  TEST = 'test',
  DEVELOP = 'dev',
  DEFAULT = 'local',
}

type TYPE_ENV = ENV.DEVELOP | ENV.TEST | ENV.DEFAULT;

class ConfigManager {
  private _config!: Config;

  define(env: TYPE_ENV) {
    switch (env) {
      case ENV.DEVELOP:
        this.config = DefaultConfig;
        break;
      case ENV.TEST:
        this.config = TestConfig;
        break;
      default:
        this.config = DefaultConfig;
        break;
    }
  }

  get() {
    if (!this._config)
      throw new Error('Please define Config, use ConfigManager.define');
    return this.config;
  }

  private set config(config: Config) {
    this._config = config;
  }

  private get config(): Config {
    return this._config;
  }
}

const i: ConfigManager = new ConfigManager();
export { i as ConfigManager };
