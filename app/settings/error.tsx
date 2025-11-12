// C:\li-post-analyzer\app\settings\error.tsx
"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <main className="card">
      <h2 style={{marginTop:0}}>Settings</h2>
      <div className="sub" style={{color:"#ef4444"}}>
        Failed to load Settings: {error?.message || "Unknown error"}
      </div>
    </main>
  );
}
