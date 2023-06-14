import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { IUser } from "../types/user.type";

class UserMiddleware {
  //
  public findAndThrow(field: keyof IUser) {
    //В аргумент field мы передаем по каком из полей user ы будем искать совпадаения в БД (Email,ID,name и т. д.)
    //keyof - метод от TS который дает возможность установить что тип аргумента функции может быть любым полем из
    // интерфейса IUser(если в аргумент передать поле которого нет в даннoм интерфейсе то будет ошибка.)
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });
        if (user) {
          throw new ApiError("User with this email already exist", 409);
        }
        next();
        //Если нашелся пользователь бросаем ошибку если нет то просто идем дальше    next();
      } catch (e) {
        next(e);
      }
    };
  }

  public isUserExist<T>(field: keyof T) {
    //В аргумент field мы передаем по каком из полей user мы будем искать совпадаения в БД (Email,ID,name и т. д.)

    //keyof - метод от TS который дает возможность установить что тип аргумента функции может быть любым полем из
    //передаваемого в джейнерик интерфейса или типа. И в аргументе должно быть одно из полей передаваемой типизации в джейнерик.
    //Только ключи из передаваемых типов в джейнерик.
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = await User.findOne({ [field]: req.body[field] });
        //ПРи помощи метода findOne ищем в БД ользователя по тому полю которое было переданно как аргумент.email: req.body.email
        if (!user) {
          throw new ApiError("User not found", 422);
          //Если пользователь по email не найден в БД то выбрасываем ошибку "User not found"
        }

        res.locals.user = user;
        //Если нашелся создаем поле locals  в  res и по ключу user ложим информацию.
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
