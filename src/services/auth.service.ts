import { EEmailActions } from "../enums/email.enum";
import { ApiError } from "../errors";
import { OldPassword } from "../models/OldPassword.modal";
import { Token } from "../models/Token.model";
import { User } from "../models/User.mode";
import { ICredentials, ITokenPayload, ITokensPair } from "../types/token.types";
import { IUser } from "../types/user.type";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: IUser): Promise<void> {
    try {
      const hashedPassword = await passwordService.hash(data.password);

      await User.create({ ...data, password: hashedPassword });
      await emailService.sendMail(data.email, EEmailActions.WELCOME, {
        name: data.name,
        url: "http://localhost:5120/activate-account/jwtToken",
      });
      //Вызваем метод endMail для отправки письмо (будет высланно при регистрации нового пользователя.)
      //В его параметры передаем:
      //1)Адресс електронной почты только что зарегистрированного пользователя
      //2)В зависимости от значения Enum которое будет переданно с EEmailActions.(WELCOME или  FORGOT_PASSWORD) с данного ENUM будет переданно значения. Для его использония что бы определить вид письма и необходимое наполнение.
      //3) Сам контекст в котором передаем информацию в виде name пользователя и  url для подтверждения. (внутри hbs через {{name}} вытягиваем передаваемые данные. )
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(
    credentials: ICredentials,
    user: IUser
  ): Promise<ITokensPair> {
    try {
      const isMatched = await passwordService.compare(
        credentials.password,
        user.password
      );
      if (!isMatched) {
        throw new ApiError("Invalid email or password", 401);
      }

      const tokensPair = await tokenService.generateTokenPair({
        _id: user._id,
        name: user.name,
      });

      await Token.create({
        ...tokensPair,
        _userId: user._id,
      });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    oldTokensPair: ITokensPair,
    //пара старых токенов.
    tokenPayload: ITokenPayload
    //информ вшитая в токен
  ): Promise<ITokensPair> {
    try {
      const tokensPair = await tokenService.generateTokenPair(tokenPayload);

      await Promise.all([
        Token.create({ _userId: tokenPayload._id, ...tokensPair }),
        //Создаем новый токен в БД будет созраненна новая пара токенов и ID пользователя для которого они будут использоваться.
        Token.deleteOne({ refreshToken: oldTokensPair.refreshToken }),
        //Передаем как парметри по которым пара токенов будет найденна и удаленна с БД (поиск будет по refreshToken)
      ]);
      //В Promise.all все фссинхронные методы внутри В Token.create создаем новую пару токенов в БДб
      //в  Token.deleteOne удаляем старую пару токенов из БД.

      return tokensPair;
      //Возращаем новую токен пару.
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async changePassword(
    dto: { newPassword: string; oldPassword: string },
    userId: string
  ): Promise<void> {
    try {
      const oldPasswords = await OldPassword.find({ _userId: userId });
      //Делаем поиск в БД где храняться старые пароли по ID user. ответ получаем массив документов.
      await Promise.all(
        oldPasswords.map(async ({ password: hash }) => {
          //Далаем итерацию асинхронных запросов в БД при каждой итерации будут сравниваться найденные пароли в БД старых паролей
          //с тем паролем на который мы хотим обновить. При каждой итерации будет происходить вызов асинхронного метода passwordService.compare с аргументами.
          const isMatched = await passwordService.compare(
            dto.newPassword,
            hash
          );
          if (isMatched) {
            //Если хотя бы один из старых паролей в БД совпадет с новым паролем то получим ошибку.Так как новый парольне должен
            //повторяться с изменными до этого паролями.
            throw new ApiError(
              "This password was used in your last changes",
              400
            );
          }
        })
      );

      const user = await User.findById(userId).select("password");
      //получаем по ID пользователя с БД только одно поле ("password")

      const isMatched = await passwordService.compare(
        //В passwordService.compare передаем два пароль старый и новый. В данном метода производиться проверка и сравнения
        //этих паролей. После проверки будет возвращаенно булин значения.
        dto.oldPassword,
        user.password
      );

      if (!isMatched) {
        throw new ApiError("Wrong old password", 400);
      }

      const newHash = await passwordService.hash(dto.newPassword);
      //Если замена пароля прошло по всем условиям то вызываем функцию которая захиширует новыйй пароль.  И веренет нам строку с захишированного пароля.
      await Promise.all([
        OldPassword.create({ password: user.password, _userId: userId }),
        //Сохраняем старый пароль в Бд используя модель для БД старых паролей.
        User.updateOne({ _id: userId }, { password: newHash }),
        //Делаем обновления данных User в БД. при помщи метода updateOne от ODM  ищем user по _id.
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
