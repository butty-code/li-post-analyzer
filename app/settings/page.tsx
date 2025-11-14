// ======================= C:\li-post-analyzer\app\settings\page.tsx =======================
"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";

const KEY_NAME = "user_openai_api_key";

export default function SettingsPage() {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle"|"ok"|"bad"|"busy">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { setKey(localStorage.getItem(KEY_NAME) || ""); } catch {}
  }, []);

  function save() {
    if (!key || !key.startsWith("sk-")) { setStatus("bad"); setMsg("Key should start with sk-"); return; }
    try { localStorage.setItem(KEY_NAME, key); setStatus("ok"); setMsg("Saved locally."); }
    catch { setStatus("bad"); setMsg("Browser blocked saving."); }
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

  function clearKey() {
    try { localStorage.removeItem(KEY_NAME); } catch {}
    setKey(""); setStatus("idle"); setMsg("Removed.");
  }

  return (
    <main className="grid" style={{gridTemplateColumns:"1fr", gap:16}}>
      <section className="card">
        <h2 style={{marginTop:0}}>Settings · Bring Your Own OpenAI Key</h2>
        <div className="sub">Stored only in your browser (localStorage). Sent over HTTPS as <code>x-openai-key</code>.</div>
      </section>

      <section className="card">
        {!mounted ? (
          <div className="sub">Loading…</div>
        ) : (
          <>
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
              <button className="btn btn-ghost" onClick={clearKey}>Remove</button>
              <span className="spacer" />
              <span className={`status ${status}`}>{msg}</span>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

// ======================= C:\li-post-analyzer\app\referrals\page.tsx =======================
"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
type Log = { ts:number; path:string; ref?:string; ua?:string };

export default function ReferralsPage(){
  const [logs,setLogs] = useState<Log[]>([]);
  const [refCode,setRefCode] = useState<string>("");

  useEffect(()=>{
    try{
      setRefCode(localStorage.getItem("ref_code")||"");
    }catch{}
    try{
      const arr:Log[] = JSON.parse(localStorage.getItem("ref_logs")||"[]");
      setLogs(arr.slice(-500).reverse());
    }catch{}
  },[]);

  function download(){
    const header = "ts_iso,ref,path,ua\n";
    const rows = logs.map(l => {
      const iso = new Date(l.ts).toISOString();
      const ref = (l.ref||"").replace(/"/g,'""');
      const path = (l.path||"").replace(/"/g,'""');
      const ua = (l.ua||"").replace(/"/g,'""');
      return `"${iso}","${ref}","${path}","${ua}"`;
    }).join("\n");
    const blob = new Blob([header+rows], {type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob); const a=document.createElement("a");
    a.href=url; a.download="referrals.csv"; a.click(); URL.revokeObjectURL(url);
  }

  function clearLogs(){
    localStorage.removeItem("ref_logs");
    setLogs([]);
  }

  return (
    <main className="grid" style={{gridTemplateColumns:"1fr", gap:16}}>
      <section className="card">
        <h2 style={{marginTop:0}}>Referrals</h2>
        <div className="sub">Ref code: <b>{refCode || "—"}</b>. Logs are stored locally in your browser.</div>
        <div className="row" style={{gap:10, marginTop:10}}>
          <button className="btn btn-outline" onClick={download} disabled={!logs.length}>Download CSV</button>
          <button className="btn btn-ghost" onClick={clearLogs} disabled={!logs.length}>Clear</button>
        </div>
      </section>

      <section className="card">
        <h3>Recent events</h3>
        {logs.length===0 ? <div className="sub">No logs yet.</div> :
          <div className="block" style={{maxHeight:400, overflow:"auto"}}>
            {logs.map((l,i)=>(
              <div key={i} style={{padding:"6px 0", borderBottom:"1px solid #1a2432"}}>
                <div className="sub">{new Date(l.ts).toLocaleString()}</div>
                <pre>{JSON.stringify(l, null, 2)}</pre>
              </div>
            ))}
          </div>
        }
      </section>
    </main>
  );
}
