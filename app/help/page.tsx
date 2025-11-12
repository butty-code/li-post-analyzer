// C:\li-post-analyzer\app\help\page.tsx
export default function HelpPage() {
  // Plain strings (no template literals) to avoid parse issues
  const recruiterIntake =
    [
      "Role: Senior Backend Engineer (Python)",
      "Location: Dublin, Hybrid 2 days/wk",
      "Range: €85–95k",
      "Impact: Own an API used by Irish customers in week one",
      "Stack: async Python, microservices, Postgres, AWS",
      "Must-haves: 5+ yrs Python, async, SQL tuning",
      "Nice: Docker, AWS",
      "Process: intro + 1 tech chat",
      "Constraints: visa considered",
      "CTA keyword: Python"
    ].join("\n");

  const batchExample =
    [
      "Senior Backend Engineer (Python) · EUR 85–95k · Hybrid Dublin (2 days/wk)",
      "Own an API used daily by Irish customers in week one.",
      "Stack: async Python, microservices, Postgres, AWS.",
      'CTA: Reply "Python" for the brief.',
      "---",
      "Cut order errors by 30% in 30 days — SME playbook",
      "Steps: 1) Map failure points  2) Owner + checklists  3) Track error rate + rework hours weekly",
      'CTA: Comment "Checklist" for the 1-page playbook.'
    ].join("\n");

  const dotEnvExample = "OPENAI_API_KEY=sk-your-key-here";

  return (
    <main className="grid" style={{ gridTemplateColumns: "1fr", gap: 16 }}>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Help · Recruiters & API Keys</h2>
        <div className="sub">
          What to paste, how to run packs, and how to set API keys (local & Vercel).
        </div>
      </section>

      <section className="card">
        <h3>Recruiter quick-start</h3>
        <ol>
          <li>Open <b>Analyze Any Text</b> on Home.</li>
          <li>Paste the 7-line intake (below) or your JD.</li>
          <li>Click <b>Recruiting Pack</b>. Copy the <i>Post</i> and the <i>Follow-up comment</i>.</li>
        </ol>
        <div className="news" style={{ marginTop: 12 }}>
          <h3>7-line intake (copy/paste)</h3>
          <pre>{recruiterIntake}</pre>
        </div>
      </section>

      <section className="card">
        <h3>Batch mode</h3>
        <p className="sub">
          Paste many drafts separated by a line containing <code>---</code>, then click <b>Run Batch</b>.
        </p>
        <div className="news" style={{ marginTop: 12 }}>
          <h3>Batch example</h3>
          <pre>{batchExample}</pre>
        </div>
      </section>

      <section className="card">
        <h3>API keys (OpenAI) — local</h3>
        <ol>
          <li>Create <code>.env.local</code> in your project root.</li>
          <li>Add your key: <code>OPENAI_API_KEY=sk-xxxxxxxx</code></li>
          <li>Restart: <code>npm run dev</code></li>
        </ol>
        <div className="news" style={{ marginTop: 12 }}>
          <h3>.env.local (example)</h3>
          <pre>{dotEnvExample}</pre>
        </div>
      </section>

      <section className="card">
        <h3>API keys — Vercel (production)</h3>
        <ol>
          <li>Vercel → Project → <b>Settings → Environment Variables</b>.</li>
          <li>Add <code>OPENAI_API_KEY</code> with your value.</li>
          <li>Redeploy (Vercel prompts automatically).</li>
        </ol>
        <p className="sub">
          Optional later: LinkedIn OAuth when approved — set{" "}
          <code>LINKEDIN_CLIENT_ID</code>, <code>LINKEDIN_CLIENT_SECRET</code>,{" "}
          <code>LINKEDIN_REDIRECT_URI</code>.
        </p>
      </section>

      <section className="card">
        <h3>Which pack to use?</h3>
        <ul>
          <li><b>Recruiting Pack</b> — roles/JDs ⇒ publish-ready post + follow-up + why-it-works.</li>
          <li><b>Consultant Pack</b> — offers/playbooks ⇒ lead-gen post + follow-up + rationale.</li>
        </ul>
      </section>
    </main>
  );
}
