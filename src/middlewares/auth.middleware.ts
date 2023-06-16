import { NextFunction, Request, Response } from "express";

import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import { Token } from "../models/Token.model";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("No token", 401);
      }

      const payload = tokenService.checkToken(accessToken, ETokenType.Access);

      const entity = await Token.findOne({ accessToken });
      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }

      req.res.locals.tokenPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.get("Authorization");
      //Получаем рефреш токен с объекта  поля  Header Authorization

      if (!refreshToken) {
        throw new ApiError("No token", 401);
      }

      const payload = tokenService.checkToken(refreshToken, ETokenType.Refresh);

      const entity = await Token.findOne({ refreshToken });
      //Находим в БД по сущности refreshToken  есть ли у нас такой токен в БД.
      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }
      //Если полученный токен в req.body прошел все проверки то далее мы его ложим в объект req в специальное поле.
      req.res.locals.oldTokenPair = entity;
      //Пара старых токенов ложим в locals.oldTokenPair  для дальнейшей обработки в сервисе
      req.res.locals.tokenPayload = { name: payload.name, _id: payload._id };
      //ложим объект с той информацией которая была  вшита в токен в спец поле .locals.tokenPayload
      //!!!Очеь важно помещать только ту информацию которая присутствует в модели Monggose. Для создания или других действий с БД через Mongoose.

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
