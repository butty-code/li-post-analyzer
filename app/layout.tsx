import "./globals.css";
import Link from "next/link";
import KeyBadge from "./components/KeyBadge";
import RefBadge from "./components/RefBadge";

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
              <div className="sub" id="route-id-layout">ROUTE: layout</div>
            </div>
            <nav className="nav">
              <Link className="nav-link" href="/">Home</Link>
              <Link className="nav-link" href="/help">Help</Link>
              <Link className="nav-link" href="/settings">Settings</Link>
              <Link className="nav-link" href="/referrals">Referrals</Link>
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