import { ETokenType } from "../enums/token-type.enum";
import { ApiError } from "../errors";
import { ActionToken } from "../models/ActionTokenModel";
import { User } from "../models/User.mode";
import { userRepository } from "../repositories/user.repository";
import { IActionTokenPayload } from "../types/token.types";
import { IUser } from "../types/user.type";
import { tokenService } from "./token.service";

class UserService {
  public async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(data: IUser): Promise<IUser> {
    return await userRepository.create(data);
  }

  public async findById(id: string): Promise<IUser> {
    return await this.getOneOrThrow(id);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    await this.getOneOrThrow(userId);

    return await User.findOneAndUpdate(
      { _id: userId },
      { ...dto },
      { returnDocument: "after" }
    );
  }

  public async deleteById(userId: string): Promise<void> {
    await this.getOneOrThrow(userId);

    await User.deleteOne({ _id: userId });
  }

  private async getOneOrThrow(field: string): Promise<IUser> {
    const user = await User.findById(field);
    if (!user) {
      throw new ApiError("User not found", 422);
    }
    return user;
  }

  async activate(activationLink: string): Promise<IUser> {
    const payloadActionToken = tokenService.checkToken<IActionTokenPayload>(
      activationLink,
      ETokenType.Activated
    );

    const user = await User.findOne({ email: payloadActionToken.email });

    const actionTokenFromDB = await ActionToken.findOne({
      email: payloadActionToken.email,
    });

    if (
      !payloadActionToken &&
      actionTokenFromDB.actionToken === activationLink
    ) {
      throw new ApiError("Неккоректная ссылка активации", 400);
    }

    return await User.findOneAndUpdate(
      { _id: user._id },
      { isActivated: true },
      { returnDocument: "after" }
    );
  }
}

export const userService = new UserService();
