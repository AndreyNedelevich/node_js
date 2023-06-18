import { model, Schema } from "mongoose";

import { User } from "./User.mode";

const actionTokenSchema = new Schema({
  actionToken: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    ref: User,
  },
});

export const ActionToken = model("actionToken", actionTokenSchema);
