import { Ticket, TicketDAO } from '../domain';
import {
  ValidatorManagerr,
  Logger,
  CryptManager,
  TYPE_USER,
  Images,
  TICKET_GET_METHOD,
} from '../../../../utils';

const Log: Logger = new Logger('Get Ticket');

const getTicketClient = async (
  dao: TicketDAO,
  userId: number,
): Promise<Array<Ticket>> => {
  return await dao.selectAllByUser(userId);
};

const getTicketTechnical = async (
  dao: TicketDAO,
  params: any,
): Promise<Array<Ticket>> => {
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const GetTicketSchema = schema.object({
    by: schema
      .string()
      .required()
      .valid(
        TICKET_GET_METHOD.ALL,
        TICKET_GET_METHOD.ACTIVE,
        TICKET_GET_METHOD.INACTIVE,
        TICKET_GET_METHOD.SOLVED,
        TICKET_GET_METHOD.UNSOLVED,
      ),
  });
  await validator.validate(GetTicketSchema, params);

  switch (params.by) {
    case TICKET_GET_METHOD.ALL:
      return await dao.selectAll();
    case TICKET_GET_METHOD.ACTIVE:
      return await dao.selectAllByActive(true);
    case TICKET_GET_METHOD.INACTIVE:
      return await dao.selectAllByActive(false);
    case TICKET_GET_METHOD.SOLVED:
      return await dao.selectAllByStatus(true);
    case TICKET_GET_METHOD.UNSOLVED:
      return await dao.selectAllByStatus(false);
    default:
      return await dao.selectAll();
  }
};

export const GetTicket = async (
  params: any,
  token: string,
  dao: TicketDAO,
): Promise<Array<Ticket>> => {
  Log.info('Beginning GetTicket case...');
  const tokenData = CryptManager.jwt.verifyToken(token);

  let response: Array<Ticket> = [];

  Log.info('validating type user...');
  if (tokenData.type === TYPE_USER.CLIENT)
    response = await getTicketClient(dao, tokenData.userId);
  else {
    response = await getTicketTechnical(dao, params);
  }

  Log.info('Recovering image...');
  for (const t of response) {
    t.filePath = await Images.get(t.filePath!);
    for (const c of t.comment!) {
      c.filePath = await Images.get(c.filePath!);
    }
  }

  return response;
};
