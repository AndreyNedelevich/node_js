import { Document } from "mongoose";
//Document - эьл базовый класс Mongoose он в себе уже имеет поле id и v(ерсийность)(ротипизированное)
export interface IUser extends Document {
  name?: string;
  age?: number;
  gender?: string;
  email: string;
  password: string;
}
