import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { UserValidator } from "../validators";

const router = Router();

router.get("/", userController.findAll);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  userController.findById
);
router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.update),
  authMiddleware.checkAccessToken,
  userController.updateById
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  authMiddleware.checkAccessToken,
  userController.deleteById
);

// Route который будет отвечать за создания фото пользователя.
router.post(
  "/:userId/avatar",
  authMiddleware.checkAccessToken,
  //Проверяем access токен который прилетит в Header c фронта
  commonMiddleware.isIdValid("userId"),
  //Проводим валидцию ID пользователя.
  fileMiddleware.isAvatarValid,
  //Логика валидации файла который прийдет с clienta
  userController.uploadAvatar
);

//Ендпоинт для удаления фото юзера.
router.delete(
  "/:userId/avatar",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.deleteAvatar
);

//Роутер для загрузки видео.
router.post(
  "/:userId/video",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.uploadVideo
);

export const userRouter = router;
