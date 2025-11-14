// ======================= C:\li-post-analyzer\app\page.tsx (ONLY if you still miss key-warnings) =======================
"use client";
import { useEffect, useState } from "react";

/* utils */
function copyText(s: string){ if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(s); const ta=document.createElement("textarea"); ta.value=s; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
function downloadTxt(filename:string,text:string){ const blob=new Blob([text],{type:"text/plain;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }
function getUserKey(){ try{ return localStorage.getItem("user_openai_api_key")||""; }catch{ return ""; } }

/* share helpers */
function encodeShare(payload:unknown){ return `${location.origin}#s=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`; }
function decodeShare(hash:string):any|null{ try{ const m=hash.match(/#s=([^&]+)/); if(!m) return null; const json=decodeURIComponent(escape(atob(m[1]))); return JSON.parse(json); }catch{ return null; } }

/* loud banner */
function Banner({ kind="info", text, onClose }:{kind?: "info"|"ok"|"err"; text: string; onClose: ()=>void}){
  const bg = kind==="ok" ? "#0e1a0e" : kind==="err" ? "#2a1212" : "#0e1520";
  const bd = kind==="ok" ? "#204a20" : kind==="err" ? "#5a2a2a" : "#1a2432";
  const fg = kind==="ok" ? "#9BE29B" : kind==="err" ? "#ffb0b0" : "#a7b3c7";
  return (
    <div className="row" style={{background:bg,border:`1px solid ${bd}`,color:fg,borderRadius:10,padding:10,justifyContent:"space-between"}}>
      <div style={{whiteSpace:"pre-wrap"}}>{text}</div>
      <button className="btn btn-outline" onClick={onClose}>Close</button>
    </div>
  );
}

/* API call wrapper */
async function call(p:string,b:any){
  const key=getUserKey(); 
  if(!key) throw new Error("No OpenAI key set. Go to Settings and paste your key, then click Test.");
  const r=await fetch(p,{method:"POST",headers:{"Content-Type":"application/json","x-openai-key":key},body:JSON.stringify(b)});
  let body: any = null;
  try{ body = await r.json(); }catch{ body = await r.text(); }
  if(!r.ok){
    const msg = typeof body==="string" ? body : (body?.error || body?.message || JSON.stringify(body));
    throw new Error(`Request failed (${r.status}): ${msg}`);
  }
  return body;
}

/* components and analyzers — use your latest working version (omitted for brevity) */
// Keep your SingleAnalyzer/BatchAnalyzer from the last working patch,
// they already use Banner + safeRun. Ensure they render Banner at top,
// and call() is used for every API call so missing key shows clearly.

export default function Page(){
  const [showKeyWarn,setShowKeyWarn] = useState(false);
  useEffect(()=>{ setShowKeyWarn(!getUserKey()); },[]);
  return(
    <main style={{display:"grid",gap:16}}>
      <section className="card">
        <h2 style={{marginTop:0}}>AI-Powered LinkedIn Post Analyzer</h2>
        <div className="sub">Copy intake, generate share links, and run single or batch packs.</div>
      </section>
      {showKeyWarn && (
        <Banner
          kind="err"
          text={`No OpenAI key set. Go to Settings and paste your key, then click Test.`}
          onClose={()=>setShowKeyWarn(false)}
        />
      )}
      {/* Render SingleAnalyzer and BatchAnalyzer here (your existing code) */}
    </main>
  );
}
