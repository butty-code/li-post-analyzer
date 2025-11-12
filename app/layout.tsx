// C:\li-post-analyzer\app\layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const css = `
*{box-sizing:border-box}html,body{height:100%}
:root{--bg:#0b0f14;--panel:#101722;--panel2:#0c121a;--ink:#e9eef7;--muted:#a7b3c7;--stroke:#223044;--brand:#4da3ff;--brand2:#2b88f7;--r:14px;--rsm:10px;--pad:18px}
body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Inter,Roboto,Arial;background:radial-gradient(1200px 800px at 20% -10%,#12233a,#0b0f14 40%),var(--bg);color:var(--ink)}
.container{max-width:1180px;margin:0 auto;padding:28px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.h1{margin:0;font-size:28px;font-weight:800}
.nav{display:flex;gap:12px;align-items:center}
.nav a{font-weight:700;padding:8px 12px;border-radius:10px;border:1px solid #1a2432;background:#0e1520}
.nav a:hover{border-color:#2a3a4f}
.sub{color:var(--muted);font-size:13px;margin-top:6px}
.card{background:linear-gradient(180deg,var(--panel),var(--panel2));border:1px solid var(--stroke);border-radius:var(--r);padding:var(--pad)}
.row{display:flex;gap:10px;align-items:center}.spacer{flex:1}
.input,.select,.textarea{width:100%;background:#0c1118;color:var(--ink);border:1px solid #1a2432;border-radius:10px;padding:10px 12px}
.textarea{min-height:140px;resize:vertical}
.btn{appearance:none;border:none;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
.btn-primary{background:linear-gradient(180deg,var(--brand),var(--brand2));color:#fff}
.btn-ghost{background:#0e1520;border:1px solid #1a2432;color:var(--ink)}
.btn-outline{background:transparent;border:1px solid #2a3a4f;color:var(--ink)}
.block{background:#0c1118;border:1px solid #1a2432;border-radius:var(--rsm);padding:12px}
.block h3{margin:0 0 8px 0;font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.35px}
pre{white-space:pre-wrap;margin:0;font-family:ui-monospace,SFMono-Regular,Consolas,Menlo,monospace;font-size:13px}
.status{font-size:12px}.status.running{color:#f59e0b}.status.done{color:#22c55e}.status.error{color:#ef4444}

/* Newspaper (white card, black text) */
.news{background:#fff;color:#0a0a0a;border:1px solid #d7dbe1;border-radius:12px;padding:16px;box-shadow:0 8px 24px rgba(0,0,0,.28)}
.news h3{margin:0 0 8px 0;font-size:14px;color:#4a5568;text-transform:uppercase;letter-spacing:.35px}
.news pre{background:transparent;color:#111;font-family:ui-serif,Georgia,"Times New Roman",serif;line-height:1.5;font-size:16px;max-width:68ch}
.news .btn-ghost{background:#f4f6f9;border:1px solid #e2e8f0;color:#111}
.news .btn-outline{border:1px solid #cbd5e1;color:#111}

/* Answer (black card, white text) */
.answer{background:#000;border:1px solid #2a2a2a;border-radius:12px;padding:16px;box-shadow:0 10px 28px rgba(0,0,0,.5);color:#fafafa}
.answer h3{margin:0 0 8px 0;font-size:14px;color:#b3b7be;text-transform:uppercase;letter-spacing:.35px}
.answer pre{background:transparent;color:#fff;font-family:ui-sans-serif,system-ui,Segoe UI,Inter,Roboto,Arial;line-height:1.55;font-size:16px;max-width:72ch}
.answer .btn-ghost{background:#0f0f0f;border:1px solid #333;color:#fff}
.answer .btn-outline{border:1px solid #444;color:#fff}

/* marker */
body::after{content:"";position:fixed;right:12px;bottom:12px;width:10px;height:10px;border-radius:50%;background:#4da3ff88}
  `.trim();

  return (
    <html lang="en">
      <head><style dangerouslySetInnerHTML={{ __html: css }} /></head>
      <body>
        <div className="container">
          <header className="header">
            <div>
              <h1 className="h1">AI-Powered LinkedIn Post Analyzer</h1>
              <div className="sub">Summarize, explain, improve. IE/UK packs. Batch mode.</div>
            </div>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/help">Help</a>
              <a href="/settings">Settings</a>
            </nav>
          </header>
          {children}
          <div style={{height:24}} />
          <div className="sub">© {new Date().getFullYear()} – Local demo. No data stored.</div>
        </div>
      </body>
    </html>
  );
}
