import Joi, { ObjectSchema } from 'joi';
import { AlbanyError } from '../core/common';

export class ValidatorManagerr {
  create() {
    return Joi;
  }

  async validate(schema: ObjectSchema, data: any): Promise<any> {
    try {
      await schema.validateAsync(data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw AlbanyError.ValidateError(error.message);
    }
  }
}
