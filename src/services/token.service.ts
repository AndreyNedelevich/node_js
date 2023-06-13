import * as jwt from "jsonwebtoken";

import { ITokensPair } from "../types/token.types";

//Вся логика которая работает с токеннами выносим в отдельный сервис. token.service

class TokenService {
  //етод будет создавать пару токеннов.
  public generateTokenPair(
    payload: Record<string, string | number>
    //Record - специальный тип для payload
  ): ITokensPair {
    //Из данного метода класса будет возвращаеться пара токенов их типизация находиться в интерфейсе ITokensPair
    const accessToken = jwt.sign(payload, "jwtAccess", { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, "jwtRefresh", { expiresIn: "30d" });
    //Ту информацию которую мы помещаем в торкен не в коем случае там не должно быть коныиденциальной информации. (Email или пароль)

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const tokenService = new TokenService();
