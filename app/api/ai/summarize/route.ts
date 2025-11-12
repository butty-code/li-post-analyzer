import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openai";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key") || "";
  if (!key) return new NextResponse("Missing x-openai-key", { status: 400 });
  const { text } = await req.json();
  const system = "You rewrite LinkedIn posts for IE/UK audiences. Be concise and clear.";
  const prompt = `Summarize this post in 5-7 lines, plain English:\n\n${text}`;
  const summary = await chatComplete({ userKey: key, system, user: prompt, max_tokens: 300 });
  return NextResponse.json({ summary });
}

