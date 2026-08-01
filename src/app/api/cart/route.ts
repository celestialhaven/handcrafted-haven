import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { serializeCart } from "@/lib/cart-data";
import { connectToDatabase } from "@/lib/mongodb";
import { Cart, Product } from "@/models";

async function populatedCart(userId: string) {
  return Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name slug price images availability stock artisan",
    populate: { path: "artisan", select: "displayName slug" },
  });
}

async function shoppingSession() {
  const session = await getSession();
  if (!session) return { error: "Sign in to use a shopping cart.", status: 401 } as const;
  return { userId: session.userId } as const;
}

export async function GET() {
  try {
    const access = await shoppingSession();
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
    const userId = access.userId;
    await connectToDatabase();
    return NextResponse.json({ cart: serializeCart(await populatedCart(userId)) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const access = await shoppingSession();
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
    const userId = access.userId;
    await connectToDatabase();
    const { productId, quantity = 1 } = await request.json();
    const amount = Math.max(1, Math.floor(Number(quantity)));
    if (!mongoose.isValidObjectId(productId)) return NextResponse.json({ error: "Invalid product." }, { status: 400 });

    const product = await Product.findOne({ _id: productId, status: "published" });
    if (!product || product.availability === "out-of-stock") {
      return NextResponse.json({ error: "This product is not currently available." }, { status: 400 });
    }
    if (product.stock > 0 && amount > product.stock) {
      return NextResponse.json({ error: `Only ${product.stock} items are available.` }, { status: 400 });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { user: userId } },
      { upsert: true, new: true },
    );
    const existing = cart.items.find((item: { product: mongoose.Types.ObjectId }) => item.product.equals(product._id));
    if (existing) {
      const nextQuantity = existing.quantity + amount;
      if (product.stock > 0 && nextQuantity > product.stock) {
        return NextResponse.json({ error: `Only ${product.stock} items are available.` }, { status: 400 });
      }
      existing.quantity = nextQuantity;
    } else {
      cart.items.push({ product: product._id, quantity: amount });
    }
    await cart.save();
    return NextResponse.json({ cart: serializeCart(await populatedCart(userId)) }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const access = await shoppingSession();
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
    const userId = access.userId;
    await connectToDatabase();
    const { productId, quantity } = await request.json();
    const amount = Math.floor(Number(quantity));
    if (!mongoose.isValidObjectId(productId) || amount < 1) {
      return NextResponse.json({ error: "Invalid cart update." }, { status: 400 });
    }
    const product = await Product.findById(productId);
    if (!product || (product.stock > 0 && amount > product.stock)) {
      return NextResponse.json({ error: product ? `Only ${product.stock} items are available.` : "Product not found." }, { status: 400 });
    }
    const result = await Cart.updateOne(
      { user: userId, "items.product": productId },
      { $set: { "items.$.quantity": amount } },
    );
    if (!result.matchedCount) return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    return NextResponse.json({ cart: serializeCart(await populatedCart(userId)) });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const access = await shoppingSession();
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: access.status });
    const userId = access.userId;
    await connectToDatabase();
    const productId = new URL(request.url).searchParams.get("productId");
    if (!productId || !mongoose.isValidObjectId(productId)) return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
    return NextResponse.json({ cart: serializeCart(await populatedCart(userId)) });
  } catch (error) {
    return apiError(error);
  }
}
