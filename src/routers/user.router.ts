import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserValidator } from "../validators";

const router = Router();

router.get("/", userController.findAll);

//Коментирую потому что логика перенесенна в egistration.
// router.post(
//   "/",
//   commonMiddleware.isBodyValid(UserValidator.create),
//   userController.create
// );

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  //В данном ендпоинте проверяем по access token аутификацию пользователя. Расшифровую токен и прверяя его на валидность.
  userController.findById
);
router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAccessToken,
  //В данном ендпоинте проверяем по access token аутификацию пользователя. Расшифровую токен и прверяя его на валидность.
  userController.updateById
);
router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  //В данном ендпоинте проверяем по access token аутификацию пользователя. Расшифровую токен и прверяя его на валидность.
  userController.deleteById
);

export const userRouter = router;
