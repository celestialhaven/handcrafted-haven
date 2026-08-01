import { NextResponse } from "next/server";
import mongoose from "mongoose";

export function apiError(error: unknown) {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (typeof error === "object" && error && "code" in error && error.code === 11000) {
    return NextResponse.json({ error: "That record already exists." }, { status: 409 });
  }

  return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
}
