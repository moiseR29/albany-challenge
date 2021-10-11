import { Comment, CommentBase } from './Comment';

export interface CommentEntity extends CommentBase {
  comment_id?: number;
  ticket_id: number;
  create_at: Date;
  user_id: number;
  file_path: string;
}

export interface CommentDAO {
  insert(data: Comment): Promise<Comment>;
  selectById(commentId: number): Promise<Array<Comment>>;
  selectAllByUser(clientId: number): Promise<Array<Comment>>;
  selectAllByTicket(ticketId: number): Promise<Array<Comment>>;
  update(data: Comment): Promise<Comment>;
}
