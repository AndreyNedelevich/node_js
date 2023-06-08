import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

// В service делаем логику запросов в БД через ODM Mongoosse (Прослойка)
class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return User.find().select("-password");
      //После return мы не указываем await этого делать не желательно так как мы ждем выполнения данного запроса в
      //файле userController и там у нас есть ** await userService.findAll();**. оэтому если мы пропишем два раза await мы будем ждать два раза.
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    return userRepository.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return User.findById(id);
  }
}

export const userService = new UserService();
