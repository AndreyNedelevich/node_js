import { IUser } from "./user.type";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export type ICredentials = Pick<IUser, "email" | "password">;

export type ITokenPayload = Pick<IUser, "name" | "_id">;

export type IActionTokenPayload = Pick<IUser, "email">;

export type ITokenAction = {
  actionToken: string;
};
