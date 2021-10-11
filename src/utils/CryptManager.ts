/* eslint-disable @typescript-eslint/ban-ts-comment */
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Logger, TYPE_USER } from '../utils';
import { ConfigManager } from '../config';

export interface TokenData {
  userId: number;
  email: string;
  type: TYPE_USER.CLIENT | TYPE_USER.TECHNICAL;
}

interface CryptConfig {
  salt: number;
  secret: string;
}

class CryptManager {
  private _jwt: JWT;
  private _crypto: Crypto;
  private _cryptConfig!: CryptConfig;

  constructor() {
    const Log = new Logger('CryptManager');
    this._jwt = new JWT(Log);
    this._crypto = new Crypto(Log);
  }

  get jwt(): JWT {
    return this._jwt;
  }

  get crypto(): Crypto {
    return this._crypto;
  }
}

class Crypto {
  private _log: Logger;

  constructor(log: Logger) {
    this._log = log;
  }

  async hash(label: string): Promise<string> {
    return await hash(label, ConfigManager.get().session.salt);
  }

  async compare(labelToCompare: string, hash: string): Promise<boolean> {
    return await compare(labelToCompare, hash);
  }

  private get log(): Logger {
    return this._log;
  }
}

class JWT {
  private _log: Logger;

  constructor(log: Logger) {
    this._log = log;
  }

  generateToken(data: TokenData): string {
    return sign(data, ConfigManager.get().session.secret, {
      expiresIn: 60 * 60,
    });
  }

  verifyToken(token: string): TokenData {
    try {
      return <TokenData>verify(token, ConfigManager.get().session.secret);
    } catch (error) {
      // @ts-ignore
      this.log.error(error.message);
      // @ts-ignore
      throw new Error(error.message);
    }
  }

  private get log(): Logger {
    return this._log;
  }
}

const i: CryptManager = new CryptManager();
export { i as CryptManager };
