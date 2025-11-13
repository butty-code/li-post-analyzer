// C:\li-post-analyzer\app\components\RefBadge.tsx
"use client";
import { useEffect, useState } from "react";

type RefLog = { ts:number; path:string; ref?:string; ua?:string };

function pushLog(ref?:string){
  try{
    const key="ref_logs";
    const arr:RefLog[] = JSON.parse(localStorage.getItem(key)||"[]");
    arr.push({ ts: Date.now(), path: window.location.pathname + window.location.search, ref, ua: navigator.userAgent });
    localStorage.setItem(key, JSON.stringify(arr).slice(0,200000));
  }catch{}
}

export default function RefBadge(){
  const [code,setCode] = useState<string|undefined>(undefined);
  useEffect(()=>{
    try{
      const url = new URL(window.location.href);
      const qref = url.searchParams.get("ref") || undefined;
      const saved = localStorage.getItem("ref_code") || undefined;
      const finalRef = qref || saved;
      if (qref) localStorage.setItem("ref_code", qref);
      setCode(finalRef);
      pushLog(qref ?? saved ?? undefined);
    }catch{}
  },[]);
  if(!code) return null;
  return (
    <a href="/referrals" title="View referral logs" style={{textDecoration:"none"}}>
      <span style={{
        display:"inline-flex",alignItems:"center",gap:6,padding:"6px 10px",
        borderRadius:999,fontWeight:700,border:"1px solid #1a2432",
        background:"#0e1520",color:"#a7b3c7"
      }}>
        <span style={{width:8,height:8,borderRadius:4,background:"#4da3ff"}}/>
        {`Ref: ${code}`}
      </span>
    </a>
  );
}
