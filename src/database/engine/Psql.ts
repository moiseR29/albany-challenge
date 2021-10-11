/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Pool, PoolClient, PoolConfig } from 'pg';
import { Logger } from '../../utils';
import { Sql, ResultQuery } from '../Sql';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PsqlConfig extends PoolConfig {}

export class Psql implements Sql {
  private _config: PsqlConfig;
  private _pool: Pool;
  private _log: Logger;

  constructor(config: PsqlConfig) {
    this._config = config;
    this._log = new Logger('PSQL');
    this._pool = new Pool({ ...this._config });
  }

  async checkConnection(): Promise<void> {
    try {
      await this.query(`SELECT 1`, []);
      this.log.info(`Psql Connection Successfully`);
    } catch (error) {
      this.log.error(`Psql Connecction error config: ${this._config}`);
      // @ts-ignore
      throw new Error(error);
    }
  }

  async query(query: string, values: any[]): Promise<ResultQuery> {
    const client: PoolClient = await this.getConnection();
    const queryResponse: ResultQuery = {
      rowCount: 0,
      rows: [],
    };

    this.log.info('query to run -> ', query);

    try {
      const result = await client.query(query, values);
      queryResponse.rowCount = result.rowCount;
      queryResponse.rows = result.rows;
    } catch (e) {
      this.log.error(e);
      // @ts-ignore
      throw e;
    } finally {
      this.log.info('Closing connection psql');
      client.release();
    }

    return queryResponse;
  }

  static async create(config: PsqlConfig): Promise<Psql> {
    const psql = new Psql(config);
    await psql.checkConnection();
    return psql;
  }

  private async getConnection(): Promise<PoolClient> {
    this.log.info('Begining connection psql');
    if (!this._config) throw new Error('Postgres Configure not Found');
    return await this._pool.connect();
  }

  private get log(): Logger {
    return this._log;
  }
}
