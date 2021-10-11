import { Ticket, TicketDAO } from '../domain';
import {
  ValidatorManagerr,
  Logger,
  CryptManager,
  TokenData,
  TYPE_USER,
} from '../../../../utils';
import { AlbanyError } from '../../../common';

const Log: Logger = new Logger('State Ticket');

const hasPermissions = (
  tokenData: TokenData,
  ticket: Ticket,
  body: any,
): boolean => {
  let greatPermission = true;

  // eslint-disable-next-line no-prototype-builtins
  if (body.hasOwnProperty('active')) {
    if (tokenData.type !== TYPE_USER.TECHNICAL) greatPermission = false;
  } else {
    if (!ticket.active) greatPermission = false;
    if (ticket.user !== tokenData.userId) greatPermission = false;
  }

  return greatPermission;
};

export const StateTicket = async (
  body: any,
  token: string,
  params: any,
  dao: TicketDAO,
): Promise<Ticket> => {
  Log.info('Beginning AttentionTicket case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const StateTicketSchema = schema.object({
    active: schema.boolean().allow(null),
    solved: schema.boolean().allow(null),
  });
  await validator.validate(StateTicketSchema, body);

  Log.info('Validating schema...');
  const StateTicketParamsSchema = schema.object({
    ticketId: schema.string().required(),
  });
  await validator.validate(StateTicketParamsSchema, params);

  Log.info('Validating exists ticket...');
  const tickets = await dao.selectById(params.ticketId);
  if (!tickets.length)
    throw AlbanyError.GenericError(`Ticket: ${params.ticketId} not found`);

  const tokenData = CryptManager.jwt.verifyToken(token);

  let [ticket] = tickets;

  // TODO verify !body.active
  if (!hasPermissions(tokenData, ticket, body))
    throw AlbanyError.GenericError(`You don´t have permission`);

  const newActive = body.active ?? ticket.active;
  const newSolved = body.solved ?? ticket.solved;

  ticket = {
    ...ticket,
    active: newActive,
    solved: newSolved,
  };

  Log.info('Updating Ticket...');
  return await dao.update(ticket);
};
