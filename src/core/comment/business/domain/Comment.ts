export interface CommentBase {
  comment: string;
}

export interface Comment extends CommentBase {
  commentId?: number;
  ticketId: number;
  createAt: Date;
  userId: number;
  filePath: string;
}
