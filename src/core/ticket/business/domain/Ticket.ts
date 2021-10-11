import { User } from '../../../user/business';

export interface TicketBase {
  description: string;
  attention?: number;
  solved: boolean;
  active: boolean;
}

export interface ICommentTicket {
  comment?: Array<{
    commentId?: number;
    userId: number;
    comment: string;
    createAt: Date;
    filePath?: string;
  }>;
}

export interface Ticket extends TicketBase, ICommentTicket {
  ticketId?: number;
  createAt: Date;
  user: number | User;
  filePath?: string;
}
