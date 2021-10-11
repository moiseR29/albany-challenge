import { Log, LogManager } from '@muzzatech/log';

export class Logger {
  private _log: Log;

  constructor(name: string) {
    this._log = LogManager.get(name);
  }

  info(message: any, ...params: any[]): void {
    this.log.info(message, ...params);
  }

  error(message: any, ...params: any[]): void {
    this.log.error(message, ...params);
  }

  fatal(message: any, ...params: any[]): void {
    this.log.fatal(message, ...params);
  }

  warn(message: any, ...params: any[]): void {
    this.log.warn(message, ...params);
  }

  debug(message: any, ...params: any[]): void {
    this.log.debug(message, ...params);
  }

  trace(message: any, ...params: any[]): void {
    this.log.trace(message, ...params);
  }

  private get log(): Log {
    return this._log;
  }
}
