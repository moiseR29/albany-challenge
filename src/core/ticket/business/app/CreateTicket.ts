import { Ticket, TicketDAO } from '../domain';
import { ValidatorManagerr, Logger, CryptManager } from '../../../../utils';

const Log: Logger = new Logger('Create Ticket');

export const CreateTicket = async (
  body: any,
  token: string,
  dao: TicketDAO,
): Promise<Ticket> => {
  Log.info('Beginning CreateTicket case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const CreateTicketSchema = schema.object({
    description: schema.string().required(),
    filePath: schema.string().allow(null, ''),
    attention: schema.number().allow(null),
    solved: schema.boolean(),
    active: schema.boolean(),
  });
  await validator.validate(CreateTicketSchema, body);

  const tokenData = CryptManager.jwt.verifyToken(token);

  const ticket: Ticket = {
    ...body,
    user: tokenData.userId,
  };

  Log.info('Creating Ticket...');
  return await dao.insert(ticket);
};
