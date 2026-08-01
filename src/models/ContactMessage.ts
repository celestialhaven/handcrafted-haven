import { Schema, model, models } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new", index: true },
  },
  { timestamps: true },
);

export const ContactMessage = models.ContactMessage || model("ContactMessage", schema);
