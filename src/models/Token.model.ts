import { model, Schema, Types } from "mongoose";

import { User } from "./User.mode";
//Так как для улушения безопасноти необходимо токенны сохранять в БД создаем отдельное модель с данными о токене и id для сохранение в БД.
const tokensSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  _userId: {
    type: Types.ObjectId,
    // Используем для типизации от Mongoose Types.ObjectId (для типизации id от MongoDB)
    // В БД будет сохранен вместе с токенами id пользователя.
    required: true,
    ref: User,
  },
  //В поле _userId: мы будем сохранять ссылку на того пользователя который выдал нам токен пару. Поэтому используем нижнее подчеркивания
  //Принято использовать нижнее подчеркивания в таких млучаях когда мы используем ref!!!
});

export const Token = model("token", tokensSchema);
