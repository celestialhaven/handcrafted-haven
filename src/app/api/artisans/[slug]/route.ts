import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product } from "@/models";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    await connectToDatabase();
    const { slug } = await context.params;
    const artisan = await Artisan.findOne({ slug }).lean();
    if (!artisan) return NextResponse.json({ error: "Artisan not found." }, { status: 404 });
    const products = await Product.find({ artisan: artisan._id, status: "published" }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ artisan, products });
  } catch (error) {
    return apiError(error);
  }
}
