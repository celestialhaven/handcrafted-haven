import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();
    if (!name || !email || typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Name, email, and a password of at least 8 characters are required." }, { status: 400 });
    }
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "buyer" });
    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
