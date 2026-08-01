import { Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const NewsletterSubscriber = models.NewsletterSubscriber || model("NewsletterSubscriber", schema);
