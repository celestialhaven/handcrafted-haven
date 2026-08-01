import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const query = request.nextUrl.searchParams.get("q")?.trim();
    const filter = query ? { $text: { $search: query } } : {};
    const artisans = await Artisan.find(filter).sort({ ratingAverage: -1 }).limit(50).lean();
    return NextResponse.json({ artisans });
  } catch (error) {
    return apiError(error);
  }
}
