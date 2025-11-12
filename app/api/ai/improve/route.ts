import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openai";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key") || "";
  if (!key) return new NextResponse("Missing x-openai-key", { status: 400 });
  const { goal = "clarity", post_text } = await req.json();
  const system = "Rewrite LinkedIn copy for IE/UK tone; concise, proof-first, clear CTA.";
  const prompt = `Goal: ${goal}\n\nRewrite this so it's publish-ready. Keep specifics, add a single CTA.\n\n${post_text}`;
  const improved = await chatComplete({ userKey: key, system, user: prompt, max_tokens: 500 });
  return NextResponse.json({ improved });
}
