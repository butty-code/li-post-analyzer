// C:\li-post-analyzer\app\settings\SettingsClient.tsx
"use client";
import { useEffect, useState } from "react";

const KEY_NAME = "user_openai_api_key";

export default function SettingsClient() {
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle"|"ok"|"bad"|"busy">("idle");

  useEffect(() => {
    setMounted(true);
    try { setKey(localStorage.getItem(KEY_NAME) || ""); } catch {}
  }, []);

  function save() {
    if (!key || !key.startsWith("sk-")) { setStatus("bad"); setMsg("Key should start with sk-"); return; }
    try { localStorage.setItem(KEY_NAME, key); setStatus("ok"); setMsg("Saved locally in this browser."); }
    catch { setStatus("bad"); setMsg("Unable to save to this browser."); }
  }

  function remove() {
    try { localStorage.removeItem(KEY_NAME); } catch {}
    setKey(""); setStatus("idle"); setMsg("Removed.");
  }

  async function test() {
    if (!key) { setStatus("bad"); setMsg("No key to test."); return; }
    setStatus("busy"); setMsg("Testing…");
    try {
      const r = await fetch("/api/keys/check", { headers: { "x-openai-key": key } });
      const body = await (r.ok ? r.json() : r.text());
      if (!r.ok) throw new Error(typeof body === "string" ? body : JSON.stringify(body));
      setStatus("ok"); setMsg(body?.message || "OK");
    } catch (e: any) {
      setStatus("bad"); setMsg(e?.message || "Failed");
    }
  }

  if (!mounted) {
    return (
      <main className="card">
        <h2 style={{marginTop:0}}>Settings</h2>
        <div className="sub">Loading…</div>
      </main>
    );
  }

  return (
    <main className="grid" style={{gridTemplateColumns:"1fr", gap:16}}>
      <section className="card">
        <h2 style={{marginTop:0}}>Settings · Bring Your Own OpenAI Key</h2>
        <div className="sub">Stored only in this browser (localStorage). Sent as <code>x-openai-key</code> header.</div>
      </section>

      <section className="card">
        <label className="sub">OpenAI API Key</label>
        <input
          className="input" type="password" placeholder="sk-..."
          value={key} onChange={(e)=>setKey(e.target.value.trim())}
        />
        <div className="row" style={{gap:10, marginTop:10}}>
          <button className="btn btn-primary" onClick={save} disabled={!key}>Save</button>
          <button className="btn btn-outline" onClick={test} disabled={!key || status==="busy"}>
            {status==="busy" ? "Testing…" : "Test"}
          </button>
          <button className="btn btn-ghost" onClick={remove}>Remove</button>
          <span className="spacer" />
          <span className={`status ${status}`}>{msg}</span>
        </div>
      </section>
    </main>
  );
}
