import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware, userMiddleware } from "../middlewares";
import { ICredentials } from "../types/token.types";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  //Используем универсальную   commonMiddleware.isBodyValid которая исапользует как аргумент способ валидации данных.
  //Данная iddleware становиться переиспольуемой.

  userMiddleware.findAndThrow("email"),
  //Далее после валидации данных начинает работать следующая middlware. Которая находит по полю передаваемому в метод как аргумент
  //(email) есть ли такой email арегистрирован в базе если есть то получаем ошибку что такой пользователь зарегистрирован.
  authController.register
);

router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  //Используем универсальную   commonMiddleware.isBodyValid которая исапользует как аргумент способ валидации данных.
  //Данная iddleware становиться переиспольуемой.

  userMiddleware.isUserExist<ICredentials>("email"),
  //Далее после валидации данных начинает работать следующая middlware. Которая находит по полю передаваемому в метод как аргумент
  //(email) соотвтествующего User или выбрасывает ошибку.
  //!!! Важно при вызове метода isUserExist необходимо в его джейнерик передать тип или интерфейс по кторому будет типизирован аргумент функции.
  authController.login
);

export const authRouter = router;
