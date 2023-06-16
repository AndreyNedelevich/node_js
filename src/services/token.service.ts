import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import { ITokenPayload, ITokensPair } from "../types/token.types";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "200s",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: ETokenType): ITokenPayload {
    //Добавляем в аргументы метода checkToken поле type для того что бы в него передвать инфу по котрой будет
    //в switch определяться по какому секретному ключу расшифровать токен (секретный ключ для access токена или refresh токена.)
    //В данном примере enum контролируем какие типы могут передаваться в данный аргумент метода.
    try {
      let secret: string;
      //По типу токена будем  подбрасывать разный secret key
      switch (type) {
        case ETokenType.Access:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.Refresh:
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }
}

export const tokenService = new TokenService();
