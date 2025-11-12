import { NextResponse } from "next/server";
import { chatComplete } from "@/lib/openai";

export async function POST(req: Request) {
  const key = req.headers.get("x-openai-key") || "";
  if (!key) return new NextResponse("Missing x-openai-key", { status: 400 });

  const { type, text }:{ type:"recruiting"|"consultant"; text:string } = await req.json();

  const system =
    type === "recruiting"
      ? "You craft high-performing LinkedIn hiring posts for IE/UK. Clear range, impact, 3-5 bullets, must-haves, single CTA keyword."
      : "You craft IE/UK lead-gen posts for consultants/SMEs. Outcome first, 3-step approach, 1 proof line, single CTA keyword.";

  const post = await chatComplete({
    userKey: key,
    system,
    user:
`Turn the notes into a publish-ready LinkedIn post. Keep specifics; no hashtags. One clear CTA ("Reply 'X'" or "Comment 'X'").
Notes:
${text}`,
    max_tokens: 500
  });

  const followup = await chatComplete({
    userKey: key,
    system,
    user:
`Write a follow-up comment (post 15–30 mins later). Restate CTA; add 1 extra practical detail (visa/process/template). Keep to 2-4 lines.
Notes:
${text}`,
    max_tokens: 220
  });

  const notes = await chatComplete({
    userKey: key,
    system: "You write short rationale for why a LinkedIn post will work (copywriting). UK spelling.",
    user: `Explain briefly why the post above works: clarity, proof, friction, CTA psychology. 4–6 bullet points.`,
    max_tokens: 220
  });

  return NextResponse.json({ post, followup, notes });
}
