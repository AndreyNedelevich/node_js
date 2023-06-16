import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware, userMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ICredentials } from "../types/token.types";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  userMiddleware.findAndThrow("email"),
  authController.register
);

router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  userMiddleware.isUserExist<ICredentials>("email"),
  authController.login
);
//Ендпоинт для изменения пароля, должно выполняться при валдных токенах поэтому в мидлВаре проверяем это.
router.post(
  "/changePassword",
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword
);

//Интпоинт для логики рефреша пары токенов.
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  //МидлВара для валидации рефреш токенна.
  authController.refresh
);

export const authRouter = router;
