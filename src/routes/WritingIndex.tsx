import { TerminalShell } from "../components/TerminalShell";

export function WritingIndex() {
  return (
    <TerminalShell chromeTitle="writing">
      <section className="lh__section">
        <p className="lh__greeting">Notes, articles, and user guides.</p>
        <hr className="lh__rule" />
        <p>
          <em>Phase-1 stub.</em> Index renders from{" "}
          <code>content/posts/*.md</code> once the markdown loader is wired
          (phase 3).
        </p>
      </section>
    </TerminalShell>
  );
}
