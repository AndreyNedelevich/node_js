import { model, Schema } from "mongoose";

// Импоритуем из  mongoose две функции для создание модели. Model это и есть наша прослойка между БД и Бекендом у нее есть свои методы
//для формипрвания запрсов на БД и получения ответов на сервере.
import { EGenders } from "../enums/user.enum";

//Создаем схему для Users.
const userSchema = new Schema(
  {
    name: {
      type: String
    },
    age: {
      type: Number,
      min: [1, "Minimum value for age is 1"],
      max: [199, "Maximum value for age is 199"]
    },
    gender: {
      type: String,
      enum: EGenders
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
  //Sхеме вторым параметром принмает конфигурационный объект.
  // versionKey: false - позволяет выключить обозначения V в объекте user оторое показывает сколько раз объект был обновлен.
  // timestamps: true  - позволяет добавить в объект два поля которые буду показывать когда объект был создан и когда объект
  // в последний раз был обновлен.
  // "createdAt": "2023-06-07T15:19:34.806Z",
  //  "updatedAt": "2023-06-07T15:19:34.806Z"
);

export const User = model("user", userSchema);
