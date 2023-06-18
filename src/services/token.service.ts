import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import {
  IActionTokenPayload,
  ITokenAction,
  ITokenPayload,
  ITokensPair,
} from "../types/token.types";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken<T>(token: string, type: ETokenType): T {
    try {
      let secret: string;
      switch (type) {
        case ETokenType.Access:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case ETokenType.Refresh:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case ETokenType.Activated:
          secret = configs.JWT_ACTION_TOKEN_SECRET;
          break;
      }

      return jwt.verify(token, secret) as T;
    } catch (e) {
      throw new ApiError("Token not valid", 401);
    }
  }

  public generateActionToken(payload: IActionTokenPayload): ITokenAction {
    const actionToken = jwt.sign(payload, configs.JWT_ACTION_TOKEN_SECRET, {
      expiresIn: "500s",
    });

    return {
      actionToken,
    };
  }
}

export const tokenService = new TokenService();
