import { Schema, model, models } from "mongoose";

const artisanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    displayName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 2000 },
    profileImageUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    specialties: [{ type: String, trim: true }],
    ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, min: 0, default: 0 },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

artisanSchema.index({ displayName: "text", location: "text", specialties: "text" });
export const Artisan = models.Artisan || model("Artisan", artisanSchema);
