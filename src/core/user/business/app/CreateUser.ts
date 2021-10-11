import { User, UserDAO, TYPE_USER } from '../domain';
import { CryptManager, ValidatorManagerr, Logger } from '../../../../utils';

const Log: Logger = new Logger('Create User');

export const CreateUser = async (body: any, dao: UserDAO): Promise<User> => {
  Log.info('Beginning CreateUser case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const CreateUserSchema = schema.object({
    name: schema.string().required(),
    lastname: schema.string().required(),
    email: schema.string().email().required(),
    company: schema.string(),
    phone: schema.string().required(),
    password: schema.string().required(),
    role: schema.string().valid(TYPE_USER.CLIENT, TYPE_USER.TECHNICAL),
    active: schema.boolean(),
  });
  await validator.validate(CreateUserSchema, body);

  Log.info('hashing password...');
  const cryptPassword = await CryptManager.crypto.hash(body.password);
  body.password = cryptPassword;

  Log.info('Creating user...');
  const newUser = await dao.insert(body);
  return newUser;
};
