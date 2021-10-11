import { User, UserBase } from './User';

export interface UserEntity extends UserBase {
  user_id: number;
}

export interface UserDAO {
  insert(data: User): Promise<User>;
  selectById(userId: number): Promise<User>;
  update(data: User): Promise<User>;
  selectByUsername(username: string): Promise<User>;
}
