import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const body = await request.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      mode: "rules",
      review: [
        "OPENAI_API_KEY no está configurada.",
        "ATLAS puede usar reglas locales hasta activar IA real."
      ]
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Eres ATLAS, director de operaciones para un estudio de interiorismo. Da una revisión breve, clara y accionable."
      },
      {
        role: "user",
        content: JSON.stringify(body)
      }
    ]
  });

  return NextResponse.json({
    mode: "ai",
    review: completion.choices[0]?.message?.content ?? ""
  });
}

