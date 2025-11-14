// C:\li-post-analyzer\app\referrals\page.tsx
"use client";
import { useEffect, useState } from "react";

type Log = { ts:number; path:string; ref?:string; ua?:string };

export default function ReferralsPage(){
  const [logs,setLogs] = useState<Log[]>([]);
  const [refCode,setRefCode] = useState<string>("");

  useEffect(()=>{
    try{
      setRefCode(localStorage.getItem("ref_code")||"");
      const arr:Log[] = JSON.parse(localStorage.getItem("ref_logs")||"[]");
      setLogs(arr.slice(-500).reverse());
    }catch{ /* ignore */ }
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
