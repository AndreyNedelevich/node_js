import bcrypt from "bcrypt";

import { configs } from "../configs/config";
//В данном файле созжаем класс с методами для работы с паролями.(хеширование и метод сравнения введенного пароля пользователям с хешировнным паролем в БД Bcrypt)
class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, +configs.SECRET_SALT);
  }

  //Метод для сравнения праоля введенного пользователе и хранящимся в хишированным паролям в БД
  public async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    //Как аргумент принимает введенный пароль и пароль хранящийся в БД (захишированный) В результате получим промис с результатом внутри true или false.
    return await bcrypt.compare(password, hashedPassword);
    //true or false
  }
}

export const passwordService = new PasswordService();
