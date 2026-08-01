import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, Product } from "@/models";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const params = request.nextUrl.searchParams;
    const filter: Record<string, unknown> = { status: "published" };
    const category = params.get("category");
    const artisan = params.get("artisan");
    const featured = params.get("featured");
    if (category) filter.category = category;
    if (artisan) filter.artisan = artisan;
    if (featured === "true") filter.featured = true;

    const limit = Math.min(Math.max(Number(params.get("limit")) || 24, 1), 100);
    const products = await Product.find(filter)
      .populate("artisan", "displayName slug location")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getSession();
    if (!session || (session.role !== "artisan" && session.role !== "admin")) {
      return NextResponse.json({ error: "Sign in as an artisan to add products." }, { status: 401 });
    }
    const body = await request.json();
    const artisan = session.role === "admin" && body.artisanId
      ? await Artisan.findById(body.artisanId)
      : await Artisan.findOne({ user: session.userId });

    if (!artisan) {
      return NextResponse.json({ error: "Create an artisan profile before adding products." }, { status: 400 });
    }

    const baseSlug = slugify(String(body.name ?? "product"));
    let slug = baseSlug;
    let suffix = 2;
    while (await Product.exists({ slug })) slug = `${baseSlug}-${suffix++}`;

    const product = await Product.create({
      artisan: artisan._id,
      name: body.name,
      slug,
      category: body.category,
      price: Number(body.price),
      description: body.description,
      availability: body.availability,
      stock: Number(body.stock ?? 0),
      images: Array.isArray(body.images) ? body.images : [],
      status: body.status === "published" ? "published" : "draft",
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
