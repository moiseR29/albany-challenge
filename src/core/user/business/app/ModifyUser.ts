import { User, UserDAO, TYPE_USER, UserError } from '../domain';
import {
  CryptManager,
  ValidatorManagerr,
  Logger,
  HTTP_STATUS,
} from '../../../../utils';

const Log: Logger = new Logger('Modify User');

export const ModifyUser = async (
  body: any,
  token: string,
  dao: UserDAO,
): Promise<User> => {
  Log.info('Beginning ModifyUser case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const ModifyUserSchema = schema.object({
    userId: schema.number().required(),
    name: schema.string(),
    lastname: schema.string(),
    company: schema.string(),
    password: schema.string(),
    phone: schema.string().required(),
    role: schema.string().valid(TYPE_USER.CLIENT, TYPE_USER.TECHNICAL),
    active: schema.boolean(),
  });
  await validator.validate(ModifyUserSchema, body);

  Log.info('Validating User...');
  const user = await dao.selectById(body.userId);

  if (!user)
    throw UserError.ModifyUserError(`user_id: ${body.userId} not found`);

  const tokenData = CryptManager.jwt.verifyToken(token);

  if (user.userId !== tokenData.userId)
    throw UserError.ModifyUserError(
      `you don´t have permission`,
      HTTP_STATUS.UNAUTHORIZED,
    );

  // TODO in case change password, valid before
  if (body.password) {
    Log.info('hashing password...');
    body.password = await CryptManager.crypto.hash(body.password);
  }

  const updateUser: User = {
    ...user,
    ...body,
  };

  Log.info('Updating user...');
  const newUser = await dao.update(updateUser);
  return newUser;
};
