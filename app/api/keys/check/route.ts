// C:\li-post-analyzer\app\api\keys\check\route.ts
import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openai";

export async function GET(req: Request) {
  const key = req.headers.get("x-openai-key") || "";
  if (!key) return new NextResponse("Missing x-openai-key", { status: 400 });
  try {
    const text = await chatComplete({
      userKey: key,
      system: "You are a health check.",
      user: "Reply with OK.",
      max_tokens: 3,
      temperature: 0,
    });
    return NextResponse.json({ ok: true, message: text || "OK" });
  } catch (e: any) {
    return new NextResponse(e.message || "Failed", { status: 400 });
  }
}
