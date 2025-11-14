"use client";
import { useEffect, useState } from "react";

/* utils */
function copyText(s: string){ if(navigator.clipboard?.writeText) return navigator.clipboard.writeText(s); const ta=document.createElement("textarea"); ta.value=s; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
function downloadTxt(filename:string,text:string){ const blob=new Blob([text],{type:"text/plain;charset=utf-8"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }
function getUserKey(){ try{ return localStorage.getItem("user_openai_api_key")||""; }catch{ return ""; } }
function encodeShare(payload:unknown){ return `${location.origin}#s=${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}`; }
function decodeShare(hash:string):any|null{ try{ const m=hash.match(/#s=([^&]+)/); if(!m) return null; const json=decodeURIComponent(escape(atob(m[1]))); return JSON.parse(json); }catch{ return null; } }

/* Banner */
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

/* API wrapper */
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

/* Output */
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

const INTAKE = [
  "Role: Senior Backend Engineer (Python)",
  "Location: Dublin (Hybrid 2 days/wk)",
  "Range: €85–95k",
  "Impact: Ship an API used by Irish customers in week one",
  "Stack: async Python, microservices, Postgres, AWS",
  "Must-haves: 5+ yrs Python, async, SQL tuning; bonus AWS/Docker",
  "Process/Constraints: intro + 1 tech chat; visa considered",
  "CTA keyword: Python",
].join("\n");

/* Single */
function SingleAnalyzer(){
  const [text,setText]=useState("");
  const [summary,setSummary]=useState(""), [answer,setAnswer]=useState(""), [improved,setImproved]=useState("");
  const [q,setQ]=useState("What are the key points?"); const [pack,setPack]=useState<{post:string;followup:string;notes:string}|null>(null);
  const [banner,setBanner]=useState<{kind:"info"|"ok"|"err";text:string}|null>(null);

  // per-action spinners
  const [isSummarizing,setIsSummarizing]=useState(false);
  const [isExplaining,setIsExplaining]=useState(false);
  const [isImproving,setIsImproving]=useState(false);
  const [isPack,setIsPack]=useState<null|"recruiting"|"consultant">(null);

  const demo=`Senior Backend Engineer (Python) · EUR 85–95k · Hybrid Dublin
Own an API used by Irish customers in week one.
- Stack: async Python, microservices, Postgres, AWS
- Hybrid: 2 days/week in Dublin 2
Must-haves: 5+ years Python, async, SQL tuning; bonus AWS/Docker
CTA: Reply "Python" for the 5-minute brief.`;

  useEffect(()=>{
    const payload = decodeShare(location.hash);
    if (payload?.mode==="single" && typeof payload.text==="string"){
      setText(payload.text);
      if (typeof payload.q === "string") setQ(payload.q);
    }
  },[]);

  function copyShare(){
    if(!text?.trim()){ setBanner({kind:"err", text:"Nothing to share. Paste or fill demo first."}); return; }
    copyText(encodeShare({ mode:"single", text, q }));
    setBanner({kind:"ok", text:"Share link copied."});
  }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h2>Analyze Any Text</h2>
        <div className="sub">IE/UK tone · Copy/Download</div>
      </div>

      {banner && <div style={{margin:"6px 0"}}><Banner kind={banner.kind} text={banner.text} onClose={()=>setBanner(null)} /></div>}

      <div className="row" style={{gap:10,flexWrap:"wrap",marginBottom:10}}>
        <button className="btn btn-ghost" onClick={()=>{copyText(INTAKE); setBanner({kind:"ok",text:"Intake copied."});}}>Copy 7-line intake</button>
        <button className="btn btn-ghost" onClick={()=>setText(demo)}>Fill demo</button>
        <button className="btn btn-outline" onClick={copyShare}>Copy share link</button>
      </div>

      <textarea className="textarea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste a LinkedIn post, JD notes, or the 7-line intake..." />

      <div className="row" style={{gap:10,flexWrap:"wrap",marginTop:10}}>
        <button className="btn btn-ghost" disabled={isSummarizing} onClick={async()=>{
          try{ setIsSummarizing(true); const r=await call("/api/ai/summarize",{text}); setSummary(r.summary); }
          catch(e:any){ setBanner({kind:"err", text:e?.message||"Failed"}); }
          finally{ setIsSummarizing(false); }
        }}>{isSummarizing?"Summarizing…":"Summarize"}</button>

        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about this post..." />

        <button className="btn btn-ghost" disabled={isExplaining} onClick={async()=>{
          try{ setIsExplaining(true); const r=await call("/api/ai/explain",{question:q,post_text:text}); setAnswer(r.answer); }
          catch(e:any){ setBanner({kind:"err", text:e?.message||"Failed"}); }
          finally{ setIsExplaining(false); }
        }}>{isExplaining?"Answering…":"Ask"}</button>

        <button className="btn btn-primary" disabled={isImproving} onClick={async()=>{
          try{ setIsImproving(true); const r=await call("/api/ai/improve",{goal:"clarity",post_text:text}); setImproved(r.improved); }
          catch(e:any){ setBanner({kind:"err", text:e?.message||"Failed"}); }
          finally{ setIsImproving(false); }
        }}>{isImproving?"Improving…":"Improve"}</button>

        <span className="spacer" />

        <button className="btn btn-ghost" disabled={!!isPack} onClick={async()=>{
          if(!text?.trim()){ setBanner({kind:"err", text:"Paste text first."}); return; }
          try{ setIsPack("recruiting"); const r=await call("/api/packs/generate",{type:"recruiting",text}); setPack({post:r.post,followup:r.followup,notes:r.notes}); }
          catch(e:any){ setBanner({kind:"err", text:e?.message||"Failed"}); }
          finally{ setIsPack(null); }
        }}>{isPack==="recruiting"?"Running…":"Recruiting Pack"}</button>

        <button className="btn btn-ghost" disabled={!!isPack} onClick={async()=>{
          if(!text?.trim()){ setBanner({kind:"err", text:"Paste text first."}); return; }
          try{ setIsPack("consultant"); const r=await call("/api/packs/generate",{type:"consultant",text}); setPack({post:r.post,followup:r.followup,notes:r.notes}); }
          catch(e:any){ setBanner({kind:"err", text:e?.message||"Failed"}); }
          finally{ setIsPack(null); }
        }}>{isPack==="consultant"?"Running…":"Consultant Pack"}</button>
      </div>

      <div className="sub" id="route-id-home">ROUTE: home</div>

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

/* Batch */
type BatchRow={idx:number;input:string;type:"auto"|"recruiting"|"consultant";status:"idle"|"running"|"done"|"error";post?:string;followup?:string;notes?:string;error?:string;};
function BatchAnalyzer(){
  const [bulk,setBulk]=useState(""); const [rows,setRows]=useState<BatchRow[]>([]);
  const [defaultType,setDefaultType]=useState<"auto"|"recruiting"|"consultant">("auto");
  const [isBatch,setIsBatch]=useState(false);
  const [banner,setBanner]=useState<{kind:"info"|"ok"|"err";text:string}|null>(null);

  const split=(s:string)=>{const p=s.split(/\n-{3,}\n/).map(x=>x.trim()).filter(x=>x.length>3); return p.length?p:s.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);};
  const guessType=(s:string)=> (s.toLowerCase().match(/hiring|apply|salary|role/)? "recruiting":"consultant") as "recruiting"|"consultant";

  useEffect(()=>{
    const payload = decodeShare(location.hash);
    if (payload?.mode==="batch" && typeof payload.text==="string"){
      setBulk(payload.text);
      if (payload.type==="recruiting"||payload.type==="consultant"||payload.type==="auto"){ setDefaultType(payload.type); }
    }
  },[]);

  function loadSamples(){ setBulk(
`Senior Backend Engineer (Python) · EUR 85–95k · Hybrid Dublin (2 days/wk)
Own an API used daily by Irish customers within your first week.
Stack: async Python, microservices, Postgres, AWS.
CTA: Reply "Python" for the brief.
---
Cut order errors by 30% in 30 days (playbook for SMEs)
Steps: 1) Map failure points  2) Checklists + owner  3) Track error rate + rework hours
CTA: Comment "Checklist" for the 1-page playbook.`); }

  async function run(){
    if(!bulk.trim()){ setBanner({kind:"err", text:"Paste at least one draft."}); return; }
    if(!getUserKey()){ setBanner({kind:"err", text:"No OpenAI key set. Go to Settings and paste your key, then click Test."}); return; }

    const inputs=split(bulk);
    const init:BatchRow[]=inputs.map((input,i)=>({idx:i+1,input,type:defaultType,status:"idle"}));
    init.forEach(r=>{ if(r.type==="auto") r.type=guessType(r.input); });
    setRows(init); setIsBatch(true);
    const out:BatchRow[]=[];

    for(const r of init){
      out.push({...r,status:"running"}); setRows([...out,...init.slice(out.length)]);
      try{
        const j=await call("/api/packs/generate",{type:r.type,text:r.input});
        out[out.length-1]={...r,status:"done",post:j.post,followup:j.followup,notes:j.notes};
      }catch(e:any){
        out[out.length-1]={...r,status:"error",error:String(e?.message || e)};
      }
      setRows([...out,...init.slice(out.length)]);
    }
    setIsBatch(false);
    setBanner({kind:"ok", text:"Batch finished."});
  }

  function exportAll(){
    const txt=rows.map(r=>[`# Item ${r.idx} (${r.type})`,`INPUT:\n${r.input}`,`POST:\n${r.post??""}`,`FOLLOW_UP_COMMENT:\n${r.followup??""}`,`WHY_IT_WORKS:\n${r.notes??""}`].join("\n\n")).join("\n\n---\n\n");
    downloadTxt("batch_outputs.txt",txt);
  }
  function copyShare(){
    if(!bulk.trim()){ setBanner({kind:"err", text:"Nothing to share. Paste drafts first."}); return; }
    copyText(encodeShare({ mode:"batch", text: bulk, type: defaultType }));
    setBanner({kind:"ok", text:"Share link copied."});
  }

  return (
    <section className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <h2>Batch Analyzer</h2>
        <div className="sub">Auto type · Download all</div>
      </div>

      {banner && <div style={{margin:"6px 0"}}><Banner kind={banner.kind} text={banner.text} onClose={()=>setBanner(null)} /></div>}

      <div className="row" style={{gap:10,flexWrap:"wrap",marginTop:10}}>
        <label className="sub">Default pack</label>
        <select className="select" value={defaultType} onChange={e=>setDefaultType(e.target.value as any)} style={{maxWidth:220}}>
          <option value="auto">auto (detect)</option><option value="recruiting">recruiting</option><option value="consultant">consultant</option>
        </select>

        <button className="btn btn-primary" onClick={run} disabled={isBatch}>{isBatch?"Running…":"Run Batch"}</button>
        <button className="btn btn-outline" onClick={exportAll} disabled={!rows.length}>Download all</button>
        <button className="btn btn-outline" onClick={copyShare}>Copy share link</button>
        <span className="spacer" />
        <button className="btn btn-ghost" onClick={loadSamples}>Load Samples</button>
      </div>

      <textarea className="textarea" value={bulk} onChange={e=>setBulk(e.target.value)} placeholder="Paste many drafts. Separate with ---" spellCheck={false}/>
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
  const [showKeyWarn,setShowKeyWarn] = useState(false);
  useEffect(()=>{ setShowKeyWarn(!getUserKey()); },[]);
  return(<main style={{display:"grid",gap:16}}>
    <section className="card">
      <h2 style={{marginTop:0}}>AI-Powered LinkedIn Post Analyzer</h2>
      <div className="sub">Copy intake, generate share links, and run single or batch packs.</div>
      <div className="sub" id="route-id-home-header">ROUTE: home</div>
    </section>
    {showKeyWarn && (<Banner kind="err" text={`No OpenAI key set. Go to Settings and paste your key, then click Test.`} onClose={()=>setShowKeyWarn(false)}/>)}
    <SingleAnalyzer/><BatchAnalyzer/></main>);
}

