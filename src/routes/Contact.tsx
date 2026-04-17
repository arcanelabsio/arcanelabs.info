import { TerminalShell } from "../components/TerminalShell";

export function Contact() {
  return (
    <TerminalShell chromeTitle="contact">
      <section className="lh__section">
        <p className="lh__greeting">How to reach Arcane Labs.</p>
        <hr className="lh__rule" />
        <p>
          <em>Phase-1 stub.</em> Rendered from{" "}
          <code>content/pages/contact.md</code> in phase 3.
        </p>
      </section>
    </TerminalShell>
  );
}
