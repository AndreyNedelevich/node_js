import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";
import { s3Service } from "./s3.service";

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(data: IUser): Promise<IUser> {
    return await userRepository.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(id);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getOneByIdOrThrow(userId);

    return await User.findOneAndUpdate(
      { _id: userId },
      { ...dto },
      { returnDocument: "after" }
    );
  }

  public async deleteById(userId: string): Promise<void> {
    await this.getOneByIdOrThrow(userId);

    await User.deleteOne({ _id: userId });
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile
    //Типизируем при помощи  UploadedFile с библиотеки express-fileupload
  ): Promise<IUser> {
    const user = await this.getOneByIdOrThrow(userId);
    //Находим user в БД по id используя внутрений  метод getOneByIdOrThrow он вернет екземпляр класса user
    if (user.avatar) {
      //Если фото у пользователя уже установленно то просто делаем его заменну. Удаляя предидущий c Bucket.
      await s3Service.deleteFile(user.avatar);
    }
    const pathToFile = await s3Service.uploadFile(avatar, "user", userId);
    //Запускаем s3Service.uploadFile передаем в него: 1)файл, 2)категорию по которой мы внутри бакета хотим разделить фото по папкам для удобства (внутри user
    // могут быть другие папки), 3)ID User  кто загрузил avatar.
    //В pathToFile  -> это будет путь к файлу.

    return await User.findByIdAndUpdate(
      //Получив путь с сервисса далее просто сохраняем его для нашего user в поле avatar
      userId,
      { $set: { avatar: pathToFile } },
      //Если необходимо только изменить одно поле используем set, если его не тспользовать то будет переписан весь объект.
      { new: true }
      //Третий параметр даст возможность вернуть актуальные данные.
    );
  }

  public async deleteAvatar(userId: string): Promise<IUser> {
    //Метод который будет удалять фото пользователя с бакета по  ID пользователя.
    const user = await this.getOneByIdOrThrow(userId);

    if (!user.avatar) {
      return user;
    }

    await s3Service.deleteFile(user.avatar);

    return await User.findByIdAndUpdate(
      userId,
      { $unset: { avatar: true } },
      { new: true }
    );
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }
}

export const userService = new UserService();
