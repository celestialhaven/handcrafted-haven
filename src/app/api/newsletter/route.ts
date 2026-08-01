import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { NewsletterSubscriber } from "@/models";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), active: true },
      { upsert: true, new: true },
    );
    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
