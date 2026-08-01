import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "handcrafted_haven_session";

export type SessionUser = {
  userId: string;
  name: string;
  email: string;
  role: "buyer" | "artisan" | "admin";
};

function getSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long.");
  }
  return new TextEncoder().encode(value);
}

export async function createSessionToken(user: SessionUser, remember = false) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? "14d" : "1d")
    .sign(getSecret());
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: String(payload.userId),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

export async function requireArtisanSession() {
  const session = await getSession();
  if (!session) redirect("/artisan/sign-in?next=/dashboard");
  if (session.role !== "artisan" && session.role !== "admin") redirect("/");
  return session;
}
