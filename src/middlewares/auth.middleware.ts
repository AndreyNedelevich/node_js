import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  //Метод checkAccessToken от AuthMiddleware - вытягивает из нашего Header c поля  Autorization прикрепленный там access Token
  //И проверяет его на валидность при помощи его расшифровки (используя секретный ключ) и проверки его на валидность
  //внутри метода checkToken (данный метод вернет расшифрованную информацию с токена.)
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.get("Authorization");
      //Получаем токен из Header с  запроса. В ответ получим access токен.

      if (!accessToken) {
        throw new ApiError("No token", 401);
      }

      const payload = tokenService.checkToken(accessToken);
      //Проверяем токен на валидность

      const entity = await Token.findOne({ accessToken });
      //Находим токен в базе данных по указанию самого токена.
      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }

      req.res.locals.tokenPayload = payload;
      //Если все хорошо создаем и ложим в отдельное поле в response locals.tokenPayload  ту информацию которую мы расшировали с токена.
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
