import { User } from "../models/User.mode";
import { IUser } from "../types/user.type";

//В данном файле мы размещаем ТОЛЬКО логику  запросов в БАЗУ ДАННЫХ И БОЛЬШЕ НЕЧЕГО!!!

class UserRepository {
  public async create(data: IUser): Promise<IUser> {
    return User.create(data);
  }
  //Пример поиска в базе по email. Одного пользователя.
  // public async findByEmail(email: string): Promise<IUser> {
  //   return User.findOne({ email: email });
  // }
}

export const userRepository = new UserRepository();
