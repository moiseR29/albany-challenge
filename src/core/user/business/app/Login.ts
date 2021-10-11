import { UserDAO, UserError } from '../domain';
import {
  ValidatorManagerr,
  CryptManager,
  Logger,
  HTTP_STATUS,
} from '../../../../utils';

const Log: Logger = new Logger('Login');

export const Login = async (body: any, dao: UserDAO): Promise<string> => {
  Log.info('Beginning Login case...');
  const validator = new ValidatorManagerr();
  const schema = validator.create();

  Log.info('Validating schema...');
  const LoginSchema = schema.object({
    email: schema.string().email().required(),
    password: schema.string().required(),
  });
  await validator.validate(LoginSchema, body);

  Log.info('Validating credentials...');
  const user = await dao.selectByUsername(body.email);
  if (!user)
    throw UserError.LoginError(
      `${body.email} not found`,
      HTTP_STATUS.NOT_FOUND,
    );

  const result = await CryptManager.crypto.compare(
    body.password,
    user.password!,
  );
  if (!result) throw UserError.LoginError(`Password incorrect`);

  if (!user.active)
    throw UserError.LoginError(
      `the user ${user.email} isn´t active`,
      HTTP_STATUS.UNAUTHORIZED,
    );

  Log.info('Generating token...');
  return CryptManager.jwt.generateToken({
    email: user.email,
    type: user.role,
    userId: user.userId!,
  });
};
