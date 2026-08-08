import { InferSchemaType, Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["buyer", "artisan", "admin"], default: "buyer" },
    avatarUrl: { type: String, default: "" },
    preferences: {
      orderEmails: { type: Boolean, default: true },
      reviewEmails: { type: Boolean, default: true },
      marketingEmails: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = models.User || model("User", userSchema);
