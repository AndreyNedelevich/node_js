import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get("/", userController.findAll);
router.post(
  "/",
  commonMiddleware.isBodyValid(UserValidator.create),
  //Передаем в метод isBodyValid как аргумент в функцию обвертку тот ВАЛИДАТОР(UserValidator.create)  по которому будет проведенна валидация.
  userController.create
);

router.get(
  "/:userId",
  //Обезательно в  commonMiddleware передаем клю id торый мы хотим провалидировать.
  //Если необходимо будет провалидировать в одном url два ключа id то вызваем Middleware два раза и передаем в каждый отдельный ID.
  commonMiddleware.isIdValid("userId"),
  //В овсем маршрутах где есть id ы его валидируем.
  userController.findById
);
router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  //Передаем в метод isBodyValid как аргумент в функцию обвертку тот ВАЛИДАТОР(UserValidator.update) по которому будет проведенна валидация.
  userController.updateById
);
router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById
);

export const userRouter = router;
