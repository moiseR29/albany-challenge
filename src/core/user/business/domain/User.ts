export enum TYPE_USER {
  CLIENT = 'C',
  TECHNICAL = 'T',
}

export type TYPE_USER_OPC = TYPE_USER.CLIENT | TYPE_USER.TECHNICAL;

export interface UserBase {
  name: string;
  lastname: string;
  email: string;
  company?: string;
  phone: string;
  password?: string;
  role: TYPE_USER_OPC;
  active: boolean;
}

export interface User extends UserBase {
  userId?: number;
}
