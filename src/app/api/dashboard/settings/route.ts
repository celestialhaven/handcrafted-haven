import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models";

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !["artisan", "admin"].includes(session.role)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const body = await request.json(); const email = String(body.email ?? "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    await connectToDatabase();
    await User.findByIdAndUpdate(session.userId, { email, preferences: { orderEmails: Boolean(body.orderEmails), reviewEmails: Boolean(body.reviewEmails), marketingEmails: Boolean(body.marketingEmails) } }, { runValidators: true });
    return NextResponse.json({ message: "Settings saved." });
  } catch (error) { return apiError(error); }
}
