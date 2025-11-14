// ======================= C:\li-post-analyzer\app\layout.tsx =======================
import KeyBadge from "./components/KeyBadge";
import RefBadge from "./components/RefBadge";
import "./globals.css";

export const metadata = {
  title: "AI-Powered LinkedIn Post Analyzer",
  description: "Summarize, explain, improve. IE/UK packs. Batch mode. BYOK.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
              <a href="/settings">Settings</a>   {/* <- correct */}
              <a href="/referrals">Referrals</a> {/* <- correct */}
              <RefBadge />
              <KeyBadge />
            </nav>
          </header>
          {children}
          <div style={{ height: 24 }} />
          <div className="sub">© {new Date().getFullYear()} – Local demo. No data stored.</div>
        </div>
      </body>
    </html>
  );
}


