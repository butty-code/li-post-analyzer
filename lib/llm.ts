import OpenAI from "openai";
import { getOpenAIKey } from "./config";

export type LLM = {
  summarize(text: string, lang?: string): Promise<string>;
  explain(post: string, question: string, ctx?: Record<string, unknown>): Promise<string>;
  improve(post: string, goal?: string): Promise<string>;
};

class OpenAIProvider implements LLM {
  client = new OpenAI({ apiKey: getOpenAIKey() });
  async summarize(text: string, lang = "en") {
    const r = await this.client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.2,
      messages: [
        { role: "system", content: "You are a concise LinkedIn editor." },
        { role: "user", content: `Summarize in ${lang}, 3 bullets, <=60 words total:\n\n${text}` }
      ]
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
  }
  async explain(post: string, question: string, ctx?: Record<string, unknown>) {
    const r = await this.client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.2,
      messages: [
        { role: "system", content: "You explain posts plainly and briefly." },
        { role: "user", content: `Post:\n${post}\n\nContext:${JSON.stringify(ctx ?? {})}\n\nQuestion:\n${question}\n\nAnswer clearly in 5–8 lines.` }
      ]
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
  }
  async improve(post: string, goal = "clarity") {
    const r = await this.client.chat.completions.create({
      model: "gpt-4o-mini", temperature: 0.3,
      messages: [
        { role: "system", content: "You rewrite LinkedIn posts for impact." },
        { role: "user", content: `Rewrite for ${goal}. Keep author's voice. <100 words. Remove filler.\n\n${post}` }
      ]
    });
    return r.choices[0]?.message?.content?.trim() ?? "";
  }
}
export function getLLM(): LLM { return new OpenAIProvider(); }
