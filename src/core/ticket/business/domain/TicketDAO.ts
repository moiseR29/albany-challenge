import { Ticket, TicketBase } from './Ticket';
import { CommentEntity } from '../../../comment';

export interface TicketEntity extends TicketBase {
  ticket_id: number;
  create_at: Date;
  user_id: number;
  file_path?: string;
  comments?: Array<CommentEntity>;
}

export interface TicketDAO {
  insert(data: Ticket): Promise<Ticket>;
  selectById(ticketId: number): Promise<Array<Ticket>>;
  selectAllByUser(clientId: number): Promise<Array<Ticket>>;
  selectAll(): Promise<Array<Ticket>>;
  selectAllByActive(status: boolean): Promise<Array<Ticket>>;
  selectAllByStatus(status: boolean): Promise<Array<Ticket>>;
  update(data: Ticket): Promise<Ticket>;
}
