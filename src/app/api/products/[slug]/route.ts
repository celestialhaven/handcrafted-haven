import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product, Review } from "@/models";

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

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "artisan" && session.role !== "admin")) {
      return NextResponse.json({ error: "Sign in as an artisan to edit products." }, { status: 401 });
    }

    await connectToDatabase();
    const { slug } = await context.params;
    const artisan = await Artisan.findOne({ user: session.userId }).select("_id");
    if (!artisan) return NextResponse.json({ error: "Artisan profile not found." }, { status: 404 });

    const product = await Product.findOne({ slug, artisan: artisan._id });
    if (!product) return NextResponse.json({ error: "Product not found or you do not have permission to edit it." }, { status: 404 });

    const body = await request.json();
    const status = ["draft", "published", "archived"].includes(body.status) ? body.status : product.status;
    product.set({
      name: body.name,
      category: body.category,
      price: Number(body.price),
      description: body.description,
      availability: body.availability,
      stock: Number(body.stock),
      status,
      featured: Boolean(body.featured),
    });
    await product.save();
    return NextResponse.json({ message: "Product updated successfully.", product });
  } catch (error) {
    return apiError(error);
  }
}
