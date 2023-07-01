import { configs } from "../configs/config";
import { IUser } from "../types/user.type";

class UserMapper {
  public toResponse(user: IUser) {
    return {
      _id: user._id,
      name: user.name,
      age: user.age,
      gender: user.gender,
      email: user.email,
      //Если какое то поля не обезательное то есть смысл делать заглушки ** user.avatar ? 1:2**
      avatar: user.avatar ? `${configs.AWS_S3_URL}/${user.avatar}` : null,
      //Так как в БД мы сохранияем URL без **https://express-node.s3.amazonaws.com** для того что бы в случае если необходимо будет поменять
      //бакет будет удобнее перенести файлы.
      //Дял этого создаем class UserMapper с один методом который будет принимать user но на фронт отдавть данные с полной URL
      //И также будет предусмотренна логика отсутствия avatar к пользователя.
    };
  }
}

export const userMapper = new UserMapper();
