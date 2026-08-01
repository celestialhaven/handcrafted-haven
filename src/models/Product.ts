import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    artisan: { type: Schema.Types.ObjectId, ref: "Artisan", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ["Home Decor", "Jewelry", "Accessories", "Textiles", "Pottery", "Woodwork", "More"],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0, index: true },
    description: { type: String, required: true, maxlength: 5000 },
    images: [{ type: String }],
    availability: {
      type: String,
      enum: ["in-stock", "made-to-order", "out-of-stock"],
      default: "in-stock",
    },
    stock: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ name: "text", description: "text", category: "text" });
export const Product = models.Product || model("Product", productSchema);
