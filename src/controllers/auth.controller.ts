import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ITokenPayload, ITokensPair } from "../types/token.types";

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
      const tokensPair = await authService.login(req.body, req.res.locals.user);

      return res.status(200).json({
        ...tokensPair,
      });
    } catch (e) {
      next(e);
    }
  }

  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokensPair>> {
    try {
      const { _id: userId } = req.res.locals.tokenPayload as ITokenPayload;

      await authService.changePassword(req.body, userId);

      return res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<ITokensPair>> {
    try {
      const oldTokenPair = req.res.locals.oldTokenPair as ITokensPair;
      const tokenPayload = req.res.locals.tokenPayload as ITokenPayload;
      //В две переменные oldTokenPair и tokenPayload (с типизацией через as) получаем старую пару токеннов и ту информацию которая быда вшита в них.

      const tokensPair = await authService.refresh(oldTokenPair, tokenPayload);
      //Вызываем метод refresh от  authService для того что бы создать новую пару токенов и зашить в нее информацию с tokenPayload.

      return res.status(200).json(tokensPair);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
