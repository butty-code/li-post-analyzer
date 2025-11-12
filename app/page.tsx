"use client";
import { useState } from "react";

/* utils */
function copyText(s: string){ if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(s); const ta=document.createElement("textarea"); ta.value=s; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
function downloadTxt(filename:string,text:string){ const blob=new Blob([text],{type:"text/plain;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }

/* Output supports variants: default | news | answer */
function Output({ title, text, name, variant="default" }:{
  title:string; text:string; name:string; variant?: "default" | "news" | "answer";
}){
  if(!text) return null;
  const cls = variant==="news" ? "news" : variant==="answer" ? "answer" : "block";
  return (
    <div className={cls}>
      <h3>{title}</h3>
      <pre>{text}</pre>
      <div className="row" style={{gap:8,marginTop:8}}>
        <button className="btn btn-ghost" onClick={()=>copyText(text)}>Copy</button>
        <button className="btn btn-outline" onClick={()=>downloadTxt(name,text)}>Download .txt</button>
      </div>
    </div>
  );
}

/* Single analyzer */
function SingleAnalyzer(){
  const [text,setText]=useState("");
  const [summary,setSummary]=useState(""); const [answer,setAnswer]=useState(""); const [improved,setImproved]=useState("");
  const [q,setQ]=useState("What are the key points?"); const [pack,setPack]=useState<{post:string;followup:string;notes:string}|null>(null);
  const [busy,setBusy]=useState(false);

  const demo=`Senior Backend Engineer (Python) · EUR 85–95k · Hybrid Dublin
Own an API used by Irish customers in week one.
- Stack: async Python, microservices, Postgres, AWS
- Hybrid: 2 days/week in Dublin 2
Must-haves: 5+ years Python, async, SQL tuning; bonus AWS/Docker
CTA: Reply "Python" for the 5-minute brief.`;

  const call=async(p:string,b:any)=>{const r=await fetch(p,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}); if(!r.ok) throw new Error(await r.text()); return r.json();};
  async function runPack(t:"recruiting"|"consultant"){ setBusy(true); try{ const r=await call("/api/packs/generate",{type:t,text}); setPack({post:r.post,followup:r.followup,notes:r.notes}); } finally{ setBusy(false); } }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:"space-between"}}><h2>Analyze Any Text</h2><div className="sub">IE/UK tone · Copy/Download</div></div>
      <textarea className="textarea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste a LinkedIn post or any text..." />
      <div className="row" style={{gap:10,flexWrap:"wrap",marginTop:10}}>
        <button className="btn btn-ghost" onClick={()=>setText(demo)}>Fill demo</button>
        <button className="btn btn-ghost" disabled={!text} onClick={async()=>setSummary((await call("/api/ai/summarize",{text})).summary)}>Summarize</button>
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about this post..." />
        <button className="btn btn-ghost" disabled={!text} onClick={async()=>setAnswer((await call("/api/ai/explain",{question:q,post_text:text})).answer)}>Ask</button>
        <button className="btn btn-primary" disabled={!text} onClick={async()=>setImproved((await call("/api/ai/improve",{goal:"clarity",post_text:text})).improved)}>Improve</button>
        <span className="spacer" />
        <button className="btn btn-ghost" disabled={!text||busy} onClick={()=>runPack("recruiting")}>Recruiting Pack</button>
        <button className="btn btn-ghost" disabled={!text||busy} onClick={()=>runPack("consultant")}>Consultant Pack</button>
      </div>

      <div style={{display:"grid",gap:12,marginTop:12}}>
        <Output variant="news"   title="Summary"        text={summary}  name="summary.txt" />
        <Output variant="answer" title="Explanation"    text={answer}   name="explanation.txt" />
        <Output variant="answer" title="Improved Post"  text={improved} name="improved.txt" />
      </div>

      {pack && (
        <div style={{display:"grid",gap:12,marginTop:12}}>
          <Output variant="answer" title="Post (ready to publish)" text={pack.post} name="pack_post.txt" />
          <Output variant="answer" title="Follow-up Comment"       text={pack.followup} name="pack_followup.txt" />
          <Output variant="news"   title="Why it works"            text={pack.notes} name="pack_notes.txt" />
        </div>
      )}
    </section>
  );
}

/* Batch analyzer */
type BatchRow={idx:number;input:string;type:"auto"|"recruiting"|"consultant";status:"idle"|"running"|"done"|"error";post?:string;followup?:string;notes?:string;error?:string;};

function BatchAnalyzer(){
  const [bulk,setBulk]=useState(""); const [rows,setRows]=useState<BatchRow[]>([]);
  const [defaultType,setDefaultType]=useState<"auto"|"recruiting"|"consultant">("auto"); const [busy,setBusy]=useState(false);

  const split=(s:string)=>{const p=s.split(/\n-{3,}\n/).map(x=>x.trim()).filter(x=>x.length>3); return p.length?p:s.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);};
  const guessType=(s:string)=> (s.toLowerCase().match(/hiring|apply|salary|role/)? "recruiting":"consultant") as "recruiting"|"consultant";

  function loadSamples(){ setBulk(
`Senior Backend Engineer (Python) · EUR 85–95k · Hybrid Dublin (2 days/wk)
Own an API used daily by Irish customers within your first week.
Stack: async Python, microservices, Postgres, AWS.
CTA: Reply "Python" for the brief.
---
Cut order errors by 30% in 30 days (playbook for SMEs)
Steps: 1) Map failure points  2) Checklists + owner  3) Track error rate + rework hours
CTA: Comment "Checklist" for the 1-page playbook.`); }

  function handlePaste(e:React.ClipboardEvent<HTMLTextAreaElement>){const t=e.clipboardData?.getData("text"); if(t){e.preventDefault(); setBulk(p=> (p?p+"\n":"")+t);}}
  function handleDrop(e:React.DragEvent<HTMLTextAreaElement>){e.preventDefault(); const f=e.dataTransfer.files?.[0]; if(f){const r=new FileReader(); r.onload=()=>setBulk(String(r.result||"")); r.readAsText(f);} else {const t=e.dataTransfer.getData("text"); if(t) setBulk(t);}}
  function handleDragOver(e:React.DragEvent<HTMLTextAreaElement>){e.preventDefault();}

  async function run(){
    const inputs=split(bulk);
    const init:BatchRow[]=inputs.map((input,i)=>({idx:i+1,input,type:defaultType,status:"idle"}));
    init.forEach(r=>{ if(r.type==="auto") r.type=guessType(r.input); });
    setRows(init); setBusy(true);
    const out:BatchRow[]=[];
    for(const r of init){
      out.push({...r,status:"running"}); setRows([...out,...init.slice(out.length)]);
      try{
        const j=await fetch("/api/packs/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:r.type,text:r.input})}).then(r=>r.json());
        out[out.length-1]={...r,status:"done",post:j.post,followup:j.followup,notes:j.notes};
      }catch(e:any){
        out[out.length-1]={...r,status:"error",error:String(e)};
      }
      setRows([...out,...init.slice(out.length)]);
    }
    setBusy(false);
  }

  function exportAll(){
    const txt=rows.map(r=>[`# Item ${r.idx} (${r.type})`,`INPUT:\n${r.input}`,`POST:\n${r.post??""}`,`FOLLOW_UP_COMMENT:\n${r.followup??""}`,`WHY_IT_WORKS:\n${r.notes??""}`].join("\n\n")).join("\n\n---\n\n");
    downloadTxt("batch_outputs.txt",txt);
  }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:"space-between"}}><h2>Batch Analyzer</h2><div className="sub">Auto type · Download all</div></div>
      <div className="row" style={{gap:10,flexWrap:"wrap",marginTop:10}}>
        <label className="sub">Default pack</label>
        <select className="select" value={defaultType} onChange={e=>setDefaultType(e.target.value as any)} style={{maxWidth:220}}>
          <option value="auto">auto (detect)</option><option value="recruiting">recruiting</option><option value="consultant">consultant</option>
        </select>
        <button className="btn btn-primary" onClick={run} disabled={!bulk.trim()||busy}>{busy?"Running…":"Run Batch"}</button>
        <button className="btn btn-outline" onClick={exportAll} disabled={!rows.length}>Download all</button>
        <span className="spacer" /><button className="btn btn-ghost" onClick={loadSamples}>Load Samples</button>
      </div>
      <textarea className="textarea" value={bulk} onChange={e=>setBulk(e.target.value)} onPaste={handlePaste} onDrop={handleDrop} onDragOver={handleDragOver} placeholder="Paste many drafts. Separate with ---" spellCheck={false}/>
      <div style={{display:"grid",gap:12,marginTop:12}}>
        {rows.map(r=>(
          <div className="block" key={r.idx}>
            <div className="row" style={{justifyContent:"space-between"}}><h3 style={{margin:0}}>Item {r.idx} · {r.type}</h3><span className={`status ${r.status}`}>{r.status}</span></div>
            <details style={{marginTop:6}}><summary className="sub">Input</summary><pre>{r.input}</pre></details>
            {r.status==="done"&&(<div style={{display:"grid",gap:10,marginTop:10}}>
              <Output variant="answer" title="Post (ready to publish)" text={r.post??""} name={`post_${r.idx}.txt`} />
              <Output variant="answer" title="Follow-up Comment"       text={r.followup??""} name={`followup_${r.idx}.txt`} />
              <Output variant="news"   title="Why it works"            text={r.notes??""} name={`why_${r.idx}.txt`} />
            </div>)}
            {r.status==="error"&&(<div className="sub" style={{color:"#ef4444"}}>{r.error}</div>)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Page(){
  return(<main style={{display:"grid",gap:16}}>
    <section className="card"><h2 style={{marginTop:0}}>AI-Powered LinkedIn Post Analyzer</h2><div className="sub">Single or batch: finished post, follow-up, and rationale (IE/UK-ready).</div></section>
    <SingleAnalyzer/><BatchAnalyzer/></main>);
}