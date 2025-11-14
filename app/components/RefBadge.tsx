// C:\li-post-analyzer\app\components\RefBadge.tsx
"use client";
import Link from "next/link";
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
    <Link href="/referrals" className="badge-link" title="View referral logs">
      <span className="badge ref-badge">
        <span className="dot" />
        {`Ref: ${code}`}
      </span>
    </Link>
  );
}
