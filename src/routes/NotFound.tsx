import { Link } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";

export function NotFound() {
  return (
    <TerminalShell chromeTitle="404">
      <section className="lh__section">
        <h1 className="lh__name">404.</h1>
        <p className="lh__greeting">That page doesn't exist.</p>
        <hr className="lh__rule" />
        <p>
          <Link to="/">Home</Link> · <Link to="/writing">Writing</Link> ·{" "}
          <a href="mailto:hello@arcanelabs.info">Contact</a>
        </p>
      </section>
    </TerminalShell>
  );
}
