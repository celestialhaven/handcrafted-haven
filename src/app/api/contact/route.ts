import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessage } from "@/models";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const message = await ContactMessage.create(await request.json());
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
