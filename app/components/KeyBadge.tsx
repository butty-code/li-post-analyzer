// C:\li-post-analyzer\app\components\KeyBadge.tsx
"use client";
import { useEffect, useState, CSSProperties } from "react";

export default function KeyBadge() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setOk(!!localStorage.getItem("user_openai_api_key"));
    } catch {
      setOk(false);
    }
  }, []);

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
    border: "1px solid",
  };

  const styleObj: CSSProperties =
    ok === true
      ? { ...base, background: "#0e1a0e", borderColor: "#204a20", color: "#9BE29B" }
      : { ...base, background: "#1a0e0e", borderColor: "#4a2020", color: "#ffb0b0" };

  const dotStyle: CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: ok ? "#22c55e" : "#ef4444",
  };

  return (
    <a href="/settings" style={{ textDecoration: "none" }}>
      <span style={styleObj}>
        <span style={dotStyle} />
        {ok ? "Key: Ready" : "Key: Missing"}
      </span>
    </a>
  );
}
