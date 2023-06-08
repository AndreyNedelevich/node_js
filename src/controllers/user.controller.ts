import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";
import { User } from "../models/User.mode";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";
import { UserValidator } from "../validators";

//Обезательно необходимо разделять логику. Controler не  должен заниматься какой то логикой или решением какой то
//задачи и логику обращение и получения информации с базы нужно выносить отдельно в Сервисы и Репозитории.
//Controller -> вызывает сервис и говорит сервису что ем необходимо выполнить. Кроме вызова сервиса и возврата полученных данных в виде ответа на фронт  в controllere больше не чего не делаем.
//Также очень важно логику валидации выносить в отдельную папку под названием middlewares. А в сам Controller должны попадать только валидные данные!!!!!!!!!

class UserController {
  //Создаем метод findAll публичный и ассинхронный который будет делать запрос в БД через Mongoose и в ответ получать
  //всех users. Он принимает как аргумент req(pзапрос), res(при помощи него даем ответ на фронт) и next -
  //для выабрасывания ошибки.
  public async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.findAll();

      return res.json(users);
    } catch (e) {
      next(e);
      //Если вылетит ошибка мы отлавливаем и передаем в next(e) -> Он в свое очередь возвращает нас назад на уровень ниже и данная ошибка
      //будет обработана в hendlere в app.ts. **app.use((err: ApiError, req: Request, res: Response, next: NextFunction)  **
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const createdUser = await userService.create(req.res.locals as IUser);
      //Данные которые прошли валидацию были помещенны в middlware в поле res.locals так как они валидны передаем их в нашу БД.
      //Обезательно типизируем их как  ***  req.res.locals as IUser  ***

      return res.status(201).json(createdUser);
    } catch (e) {
      next(e);
      //Вызываем next(e) ->  передаем в него ошибку и данная ошибка
      //будет обработана в hendlere в app.ts. **app.use((err: ApiError, req: Request, res: Response, next: NextFunction)  **
    }
  }

  public async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const user = await userService.findById(req.params.id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { id } = req.params;

      const { error, value } = UserValidator.update.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { ...value },
        { returnDocument: "after" }
      );

      return res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { id } = req.params;
      await User.deleteOne({ _id: id });

      return res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();