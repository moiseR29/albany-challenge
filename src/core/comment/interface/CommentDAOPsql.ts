/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Comment, CommentDAO, CommentEntity } from '../business';
import { DBManager, Sql } from '../../../database';
import { AlbanyError } from '../../common';

const format = (data: CommentEntity): Comment => {
  const { create_at, file_path, ticket_id, user_id, comment_id, ...rest } =
    data;
  return {
    ...rest,
    createAt: create_at,
    filePath: file_path,
    ticketId: ticket_id,
    userId: user_id,
    commentId: comment_id,
  };
};

export class CommentDAOPsql implements CommentDAO {
  private _db: Sql;

  constructor() {
    this._db = DBManager.get();
  }

  async selectById(commentId: number): Promise<Comment[]> {
    try {
      const query = `SELECT * FROM business.comment WHERE comment_id = $1 ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [commentId]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAllByUser(clientId: number): Promise<Comment[]> {
    try {
      const query = `SELECT * FROM business.comment WHERE user_id = $1 ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [clientId]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async selectAllByTicket(ticketId: number): Promise<Comment[]> {
    try {
      const query = `SELECT * FROM business.comment WHERE ticket_id = $1 ORDER BY 1 DESC;`;
      const r = await this.db.query(query, [ticketId]);
      return r.rows.map(format);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async insert(data: Comment): Promise<Comment> {
    try {
      const query = `INSERT INTO business.comment (comment, file_path, ticket_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`;
      const r = await this.db.query(query, [
        data.comment,
        data.filePath ?? '',
        data.ticketId,
        data.userId,
      ]);
      return format(r.rows[0]);
    } catch (error) {
      // @ts-ignore
      throw AlbanyError.DBError(error.message);
    }
  }

  async update(data: Comment): Promise<Comment> {
    try {
      const query = `UPDATE business.comment set comment = $1, file_path = $2 WHERE comment_id = $3 RETURNING *;`;
      const r = await this.db.query(query, [
        data.comment,
        data.filePath ?? '',
        data.commentId!,
      ]);
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
