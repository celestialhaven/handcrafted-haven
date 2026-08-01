import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const isJson = request.headers.get("content-type")?.includes("application/json");
    const submitted = isJson
      ? await request.json()
      : Object.fromEntries(await request.formData());
    const { email, password, accountType } = submitted;
    const remember = submitted.remember === true || submitted.remember === "on";
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(String(password), user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (accountType === "buyer" && user.role !== "buyer") {
      return NextResponse.json({ error: "This is an artisan account. Please use Artisan Sign In." }, { status: 403 });
    }
    if (accountType === "artisan" && user.role !== "artisan" && user.role !== "admin") {
      return NextResponse.json({ error: "This is a customer account. Please use Customer Sign In." }, { status: 403 });
    }

    const token = await createSessionToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }, remember);

    const redirectTo = accountType === "artisan" || user.role === "artisan" || user.role === "admin" ? "/dashboard" : "/";
    const response = isJson
      ? NextResponse.json({
          user: { id: user._id, name: user.name, email: user.email, role: user.role },
          redirectTo,
        })
      : NextResponse.redirect(new URL(redirectTo, request.url), 303);
    const forwardedProtocol = request.headers.get("x-forwarded-proto");
    const secureCookie = forwardedProtocol
      ? forwardedProtocol === "https"
      : new URL(request.url).protocol === "https:";
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie,
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 14 : 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
