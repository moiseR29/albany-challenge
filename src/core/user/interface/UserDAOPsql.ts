/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User, UserDAO, UserEntity } from '../business';
import { DBManager, Sql } from '../../../database';
import { AlbanyError } from '../../common';

const format = (data: UserEntity): User => {
  const { user_id, ...rest } = data;
  return {
    ...rest,
    userId: user_id,
  };
};

export class UserDAOPsql implements UserDAO {
  private _db: Sql;

  constructor() {
    this._db = DBManager.get();
  }

  async insert(data: User): Promise<User> {
    try {
      const r = await this.db.query(
        'INSERT INTO business.user (name, lastname, email, company, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [
          data.name,
          data.lastname,
          data.email,
          data.company ?? '',
          data.phone,
          data.password,
          data.role,
        ],
      );
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectById(userId: number): Promise<User> {
    try {
      const r = await this.db.query(
        'SELECT * FROM business.user WHERE user_id = $1',
        [userId],
      );
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectByUsername(username: string): Promise<User> {
    try {
      const r = await this.db.query(
        'SELECT * FROM business.user WHERE email = $1',
        [username],
      );
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async update(data: User): Promise<User> {
    try {
      const r = await this.db.query(
        'UPDATE business.user SET name = $1, lastname = $2, email = $3, company = $4, phone = $5, password = $6, role = $7, active = $8 WHERE user_id = $9 RETURNING *;',
        [
          data.name,
          data.lastname,
          data.email,
          data.company ?? '',
          data.phone,
          data.password,
          data.role,
          data.active,
          data.userId,
        ],
      );
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  private get db(): Sql {
    return this._db;
  }
}
