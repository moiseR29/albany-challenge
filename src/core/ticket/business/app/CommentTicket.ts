import { Ticket, TicketDAO } from '../domain';
import { ValidatorManagerr, Logger, CryptManager } from '../../../../utils';
import { AlbanyError } from '../../../common';
import { CommentDAO, Comment } from '../../../comment';

const Log: Logger = new Logger('Comment Ticket');

export const CommentTicket = async (
  body: any,
  token: string,
  params: any,
  dao: TicketDAO,
  commentDAO: CommentDAO,
): Promise<Ticket> => {
  Log.info('Beginning CommentTicket case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const CommentTicketSchema = schema.object({
    comment: schema.string().required(),
    filePath: schema.string().allow(null, ''),
  });
  await validator.validate(CommentTicketSchema, body);

  Log.info('Validating schema...');
  const CommentTicketParamsSchema = schema.object({
    ticketId: schema.string().required(),
  });
  await validator.validate(CommentTicketParamsSchema, params);

  Log.info('Validating exists ticket...');
  const tickets = await dao.selectById(params.ticketId);
  if (!tickets.length)
    throw AlbanyError.GenericError(`Ticket: ${params.ticketId} not found`);

  const tokenData = CryptManager.jwt.verifyToken(token);

  if (tickets[0].user !== tokenData.userId)
    throw AlbanyError.GenericError(`You don´t have permission`);

  Log.info('Creating Comment...');
  const comment: Comment = {
    ...body,
    userId: tokenData.userId,
    ticketId: tickets[0].ticketId!,
  };

  await commentDAO.insert(comment);

  return (await dao.selectById(tickets[0].ticketId!))[0];
};
