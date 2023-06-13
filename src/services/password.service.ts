import bcrypt from "bcrypt";

import { configs } from "../configs/config";
//В данном файле созжаем класс с методами для работы с паролями.(хеширование и метод сравнения введенного пароля пользователям с хешировнным паролем в БД Bcrypt)
class PasswordService {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, +configs.SECRET_SALT);
  }

  public async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();
