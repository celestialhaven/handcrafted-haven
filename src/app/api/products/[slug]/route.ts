import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Review } from "@/models";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    const product = await Product.findOne({ slug, status: "published" })
      .populate("artisan", "displayName slug location bio profileImageUrl ratingAverage ratingCount")
      .lean();
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const reviews = await Review.find({ product: product._id }).populate("user", "name avatarUrl").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ product, reviews });
  } catch (error) {
    return apiError(error);
  }
}
