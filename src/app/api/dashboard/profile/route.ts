import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { Artisan, User } from "@/models";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !["artisan", "admin"].includes(session.role)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json();
    const displayName = String(body.displayName ?? "").trim();
    if (!displayName) return NextResponse.json({ error: "Display name is required." }, { status: 400 });
    await connectToDatabase();
    const artisan = await Artisan.findOneAndUpdate({ user: session.userId }, { displayName, location: String(body.location ?? "").trim(), bio: String(body.bio ?? "").trim(), specialties: String(body.specialties ?? "").split(",").map((x) => x.trim()).filter(Boolean) }, { new: true, runValidators: true });
    if (!artisan) return NextResponse.json({ error: "Artisan profile not found." }, { status: 404 });
    await User.findByIdAndUpdate(session.userId, { name: displayName });
    return NextResponse.json({ message: "Profile updated." });
  } catch (error) { return apiError(error); }
}
