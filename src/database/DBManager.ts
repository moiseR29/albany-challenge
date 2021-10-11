import { Sql } from './Sql';

class DBManager {
  private _sql!: Sql;

  define(sql: Sql) {
    this._sql = sql;
  }

  get(): Sql {
    return this._sql;
  }
}

const i: DBManager = new DBManager();
export { i as DBManager };
