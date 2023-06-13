import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { User } from "../models/User.mode";
import { ICredentials, ITokensPair } from "../types/token.types";
import { IUser } from "../types/user.type";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

//Сервис с логикой ркгистрации и логинации, методы вызываються в контролере.
class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(data.password);
      // Хешируем наш пароль. Это опреция являеться асинхронной. Вызываем метод созданный в password.service.Он веренет захишированный пароль.
      await User.create({ ...data, password: hashedPassword });
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokensPair> {
    //Как аргумент для логинации метод принимает
    // 1)credentials(Имеил и Пароль введенные пользователем) интерфейс для типизации  для данного аргумента создан в папке types
    //2)user тот пользователь который есть в БД в контролере он будет найден в midleware. Передаем его что бы вытянуть тот захишированный пароль
    //который будет найдет в БД по введенному  Email от пользователя.
    try {
      //TODO: remove, settle inside of the middleware
      user = await User.findOne({ email: credentials.email });
      //В данной логике находим в БД user по введенному email (о по правильному данная логика должна быть вынесенна в отдельную Middleware)

      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );
      //В методе passwordService.compare делаем сравнения паролей введеного пользователем и в БД.
      // return rue or false
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      //Если все ОК создаем токен пару  при помощи мтоеда с класса tokenService.generateTokenPair()
      const tokensPair = await tokenService.generateTokenPair({
        _id: user._id,
      });
//Сохраняем пару токенов БД презатерая старые если они были в ней. Передаем пару токенов и ID user найденого при логинации по email.
      await Token.create({
        ...tokensPair,
        _userId: user._id,
      });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
