import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokensPair } from "../types/token.types";

//Контродлер который отвечает за процеа авторизации и логинации.
class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      await authService.register(req.body);

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokensPair>> {
    try {
      const tokensPair = await authService.login(
        req.body,
        req.res.locals.user
        // Информация с midleware в котрой будет найден пользователей по email который он ввел при логинации вернеться или пользователь или ошибка
        //нет такого пользователя.
      );

      return res.status(200).json({
        ...tokensPair,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
