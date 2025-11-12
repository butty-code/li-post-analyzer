import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openai";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key") || "";
  if (!key) return new NextResponse("Missing x-openai-key", { status: 400 });
  const { question, post_text } = await req.json();
  const system = "Explain like I'm busy but smart. UK spelling. Short, clear.";
  const prompt = `Post:\n${post_text}\n\nQuestion:\n${question}\n\nAnswer in 6-10 lines.`;
  const answer = await chatComplete({ userKey: key, system, user: prompt, max_tokens: 400 });
  return NextResponse.json({ answer });
}
