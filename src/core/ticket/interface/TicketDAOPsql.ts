/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Ticket, TicketDAO, TicketEntity } from '../business';
import { DBManager, Sql } from '../../../database';
import { AlbanyError } from '../../common';

const format = (data: TicketEntity): Ticket => {
  const {
    user_id,
    ticket_id,
    create_at,
    file_path,
    comments = [],
    ...rest
  } = data;

  const format: Ticket = {
    ...rest,
    ticketId: ticket_id,
    createAt: create_at,
    filePath: file_path,
    user: user_id,
    comment: [],
  };

  if (comments.length && comments[0]) {
    format.comment = comments.map((i) => ({
      commetId: i.comment_id!,
      userId: i.user_id,
      comment: i.comment,
      createAt: i.create_at,
      filePath: i.file_path ?? '',
    }));
  }

  return format;
};

export class TicketDAOPsql implements TicketDAO {
  private _db: Sql;

  constructor() {
    this._db = DBManager.get();
  }

  async insert(data: Ticket): Promise<Ticket> {
    try {
      const query = `INSERT INTO business.ticket (user_id, description, file_path) VALUES ($1, $2, $3) RETURNING *;`;
      const r = await this.db.query(query, [
        data.user,
        data.description,
        data.filePath ?? '',
      ]);
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAllByUser(clientId: number): Promise<Ticket[]> {
    try {
      const query = `SELECT 
                      	t.*, json_agg(c.*) as comments
                      FROM business.ticket t
                      LEFT JOIN business.comment c on c.ticket_id = t.ticket_id
                      WHERE t.user_id = $1
                      GROUP BY t.ticket_id
                      ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [clientId]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectById(ticketId: number): Promise<Ticket[]> {
    try {
      const query = `SELECT 
                      	t.*, json_agg(c.*) as comments
                      FROM business.ticket t
                      LEFT JOIN business.comment c on c.ticket_id = t.ticket_id
                      WHERE t.ticket_id = $1
                      GROUP BY t.ticket_id
                      ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [ticketId]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAll(): Promise<Ticket[]> {
    try {
      const query = `SELECT 
                      	t.*, json_agg(c.*) as comments
                      FROM business.ticket t
                      LEFT JOIN business.comment c on c.ticket_id = t.ticket_id
                      GROUP BY t.ticket_id
                      ORDER BY 1 DESC;`;
      const r = await this.db.query(query, []);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAllByActive(status: boolean): Promise<Ticket[]> {
    try {
      const query = `SELECT 
                      	t.*, json_agg(c.*) as comments
                      FROM business.ticket t
                      LEFT JOIN business.comment c on c.ticket_id = t.ticket_id
                      WHERE t.active = $1
                      GROUP BY t.ticket_id
                      ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [status]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAllByStatus(status: boolean): Promise<Ticket[]> {
    try {
      const query = `SELECT 
                      	t.*, json_agg(c.*) as comments
                      FROM business.ticket t
                      LEFT JOIN business.comment c on c.ticket_id = t.ticket_id
                      WHERE t.solved = $1
                      GROUP BY t.ticket_id
                      ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [status]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async update(data: Ticket): Promise<Ticket> {
    try {
      const query = `UPDATE business.ticket set description = $1, file_path = $2, attention = $3, solved = $4, active = $5 WHERE ticket_id = $6 RETURNING *;`;
      const r = await this.db.query(query, [
        data.description,
        data.filePath,
        data.attention,
        data.solved,
        data.active,
        data.ticketId,
      ]);
      return r.rows[0];
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  private get db(): Sql {
    return this._db;
  }
}
