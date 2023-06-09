import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

// В service делаем логику запросов в БД через ODM Mongoosse (Прослойка) Также логику запросов в БД по правилам хорошего тона выносят в файл .repository
// Основные манипуляции с данными их преобразование и так далее делаються на уровне сервиса. Например запрос на какую то другую API
// Вся сложная логика делаеться в сервисе.

class UserService {
  public async findAll(): Promise<IUser[]> {
    try {
      return await User.find().select("-password");
      //Используем await то бы иметь возможность отловить ошибки. В даннм блоке.
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async create(data: IUser): Promise<IUser> {
    //Как аргумент данный метод получает User типа IUser и возвращаает Promise
    return await userRepository.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return await User.findById(id);
  }
}

export const userService = new UserService();
