import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "not_implemented",
    next: "Connect a document OCR provider or OpenAI vision model server-side.",
    extracts: {
      client: null,
      project: null,
      amount: null,
      date: null,
      documentType: null
    }
  });
}

