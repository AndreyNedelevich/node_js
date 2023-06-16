import { model, Schema, Types } from "mongoose";

import { User } from "./User.mode";

//Создаем модель для хранения в БД по ID пользователя всеx старых паролей которые были  измененны пользователем.

const oldPasswordSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      required: true,
      ref: User,
    },
  },
  { versionKey: false, timestamps: true }
  //timestamps: true - время создания и время обновления будет добавляться.
);

export const OldPassword = model("oldPassword", oldPasswordSchema);
