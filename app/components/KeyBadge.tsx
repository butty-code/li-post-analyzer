// C:\li-post-analyzer\app\components\KeyBadge.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function KeyBadge() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try { setOk(!!localStorage.getItem("user_openai_api_key")); } catch { setOk(false); }
  }, []);

  return (
    <Link href="/settings" className="badge-link" title="Open settings">
      <span className={`badge key-badge ${ok ? "ok" : "missing"}`}>
        <span className="dot" />
        {ok ? "Key: Ready" : "Key: Missing"}
      </span>
    </Link>
  );
}
