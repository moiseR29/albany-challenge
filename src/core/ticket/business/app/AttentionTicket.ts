import { Ticket, TicketDAO } from '../domain';
import { ValidatorManagerr, Logger, CryptManager } from '../../../../utils';
import { AlbanyError } from '../../../common';
import { CommentDAO, Comment } from '../../../comment';

const Log: Logger = new Logger('Attention Ticket');

export const AttentionTicket = async (
  body: any,
  token: string,
  params: any,
  dao: TicketDAO,
  commentDAO: CommentDAO,
): Promise<Ticket> => {
  Log.info('Beginning AttentionTicket case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const AttentionTicketSchema = schema.object({
    comment: schema.string().required(),
    filePath: schema.string().allow(null, ''),
  });
  await validator.validate(AttentionTicketSchema, body);

  Log.info('Validating schema...');
  const AttentionTicketParamsSchema = schema.object({
    ticketId: schema.string().required(),
  });
  await validator.validate(AttentionTicketParamsSchema, params);

  Log.info('Validating exists ticket...');
  const tickets = await dao.selectById(params.ticketId);
  if (!tickets.length)
    throw AlbanyError.GenericError(`Ticket: ${params.ticketId} not found`);

  const tokenData = CryptManager.jwt.verifyToken(token);

  let [ticket] = tickets;

  ticket = {
    ...ticket,
    attention: tokenData.userId,
  };

  Log.info('Creating Comment...');
  const comment: Comment = {
    ...body,
    userId: tokenData.userId,
    ticketId: ticket.ticketId!,
  };

  await commentDAO.insert(comment);

  Log.info('Updating Ticket...');
  return await dao.update(ticket);
};
