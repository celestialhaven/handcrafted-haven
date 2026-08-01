import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    artisan: { type: Schema.Types.ObjectId, ref: "Artisan", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const addressSchema = new Schema(
  {
    fullName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], validate: [(value: unknown[]) => value.length > 0, "Order needs an item"] },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    shippingAddress: { type: addressSchema, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", orderSchema);
