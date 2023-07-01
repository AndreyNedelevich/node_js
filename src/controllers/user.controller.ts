import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
//Импоритруем UploadedFile для типизации получаемого файла.
import multer from "multer";
import { createReadStream } from "streamifier";

import { ApiError } from "../errors";
import { userMapper } from "../mapers/user.mapper";
import { s3Service } from "../services/s3.service";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
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
    }
  }

  public async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<IUser>> {
    try {
      const { userId } = req.params;

      const user = await userService.findById(userId);

      const response = userMapper.toResponse(user);
      return res.json(response);
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
      const { userId } = req.params;

      const updatedUser = await userService.updateById(userId, req.body);

      const response = userMapper.toResponse(updatedUser);
      return res.status(200).json(response);
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
      const { userId } = req.params;

      await userService.deleteById(userId);

      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  //Контролее отвечает за логику загрузки фото ползователя.
  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;
      //Достаем iD пользователя
      const avatar = req.files.avatar as UploadedFile;
      //Достаем файл с req.files. Типизируем его при помощи UploadedFile. Указывая что это будет только один файл.


      const user = await userService.uploadAvatar(userId, avatar);
      //Сервис будет принимать userId  и  avatar

      const response = userMapper.toResponse(user);
      return res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void>> {
    try {
      const { userId } = req.params;

      const user = await userService.deleteAvatar(userId);

      const response = userMapper.toResponse(user);
      return res.status(201).json(response);
      //Возвращаем в response статус и  данные о самом user
    } catch (e) {
      next(e);
    }
  }

  public async uploadVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { userId } = req.params;
      const upload = multer().single("");

      upload(req, res, async (err) => {
        if (err) {
          throw new ApiError("Download error", 500);
        }
        const video = req.files.video as UploadedFile;

        const stream = createReadStream(video.data);

        const pathToVideo = await s3Service.uploadFileStream(
          stream,
          "user",
          userId,
          video
        );
        return res.status(201).json(pathToVideo);
      });
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
