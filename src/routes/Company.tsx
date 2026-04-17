import { TerminalShell } from "../components/TerminalShell";

export function Company() {
  return (
    <TerminalShell chromeTitle="company">
      <section className="lh__section">
        <p className="lh__greeting">Details about Arcane Labs.</p>
        <hr className="lh__rule" />
        <p>
          <em>Phase-1 stub.</em> Rendered from{" "}
          <code>content/pages/company.md</code> in phase 3.
        </p>
      </section>
    </TerminalShell>
  );
}
