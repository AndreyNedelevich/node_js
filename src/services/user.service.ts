import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { userRepository } from "../repositories/user.repository";
import { IUser } from "../types/user.type";

class UserService {
  //Убираем try catch так как все ошибки будут отловленны и выброшенны не уровне controllers.
  public async findAll(): Promise<IUser[]> {
    return await User.find();
    // return await User.find().select("+password")
    //В те моменты в  котоирых нам будет нужен пароль добавляем к команде mongoose .select("+password")
  }

  public async create(data: IUser): Promise<IUser> {
    return await userRepository.create(data);
    // По правилам что бы отолавливать ошибки в тех блоках здесь прописываем await. Технически этого можно было не делать.
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneByIdOrThrow(id);
    //Через внутрений метод в классе вВозвращаем пользователя по ID если он будет найдет в БД или будет выброшенная ошибка с статус кодом 422
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    // Для типизации второго аргумента dto испоользуем Partial и в его джейнерик передаем интерфейс нашего User,
    //!!! Partial делаем все поля интерфейса User не обезательными для наличия в передаваемом объекте.
    await this.getOneByIdOrThrow(userId);
    //Перед тем как искать пользователя по iD в БД проверяем при помощи внутренего метода getOneByIdOrThrow есть ли он в БД

    //И метода updateById внутри сервиса возвращаем резульат запроса в БД при помощи метода findOneAndUpdate mongoose в аргумент которого
    //передаем id -> того User которого мы хотим обновить
    // Вторым аргументо ...dto  поля которые мы хотим обновить в документе.Они будут просто замененны в БД на новые значения.
    //Третим аргументом **  { returnDocument: "after" } ** что бы возврат на фронт данных о пользвателе был осуществлен после его обновленияв БЛ
    return await User.findOneAndUpdate(
      { _id: userId },
      { ...dto },
      { returnDocument: "after" }
    );
  }

  public async deleteById(userId: string): Promise<void> {
    //Данныц меотд возвращает Promise в котором не чего не будет void.
    //Создаем метод в сервисах для удаление из БД User по id Метод передаем и вызываем внутри Controller
    await this.getOneByIdOrThrow(userId);
    //Переходим к удалению пользователя из БД только если он будет найден БД, если его там не будет мы вылетакм с ошибкой на handler d app.ts
    await User.deleteOne({ _id: userId });
  }

  private async getOneByIdOrThrow(userId: string): Promise<IUser> {
    //В сервисах создаем метод который будет приватным и при вызове данного метода внутри других методов при помщи this
    // мы будет проверять есть ли в базе  такой пользователь по заданному ID при помощи обращение к БД (**User.findById(userId)**)
    //Если такого пользователя нет выбрасываем ошибку  и спциальный статус код через apiError
    //Если такой пользователь имееться в БД возвращаем просто данного user

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }
}

export const userService = new UserService();
