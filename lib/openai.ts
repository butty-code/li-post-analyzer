cd C:\li-post-analyzer
mkdir lib -Force | Out-Null
@'
export async function chatComplete({
  userKey,
  system,
  user,
  model = process.env.DEFAULT_OPENAI_MODEL || "gpt-4o-mini",
  temperature = 0.2,
  max_tokens = 700,
}: {
  userKey: string;
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}) {
  if (!userKey) throw new Error("Missing OpenAI key");
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature,
      max_tokens,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`OpenAI error: ${t}`);
  }
  const j = await r.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}
'@ | Set-Content -Encoding UTF8 .\lib\openai.ts
