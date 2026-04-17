import { Link, useLocation } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";

export function NotFound() {
  const location = useLocation();
  const attempted = location.pathname + location.search;

  return (
    <TerminalShell chromeTitle="404 — not found">
      <section className="lh__section">
        <h1 className="lh__name">404.</h1>
        <p className="lh__greeting">
          <code>{attempted}</code> isn't here.
        </p>
        <hr className="lh__rule" />
        <p>
          Either the URL has a typo or something was linked that no
          longer exists. The catalog keeps itself honest, so if you
          followed a link from somewhere on this site that landed
          here, please{" "}
          <a href="mailto:hello@arcanelabs.info?subject=Broken%20link">
            let us know
          </a>
          .
        </p>
      </section>

      <section className="lh__section">
        <div className="lh__sep">
          ── <strong>TRY</strong> ────────────────────────────────────────────────
        </div>
        <ul className="lh__list">
          <li>
            <Link to="/">
              <strong>/</strong>
            </Link>{" "}
            — home. What Arcane Labs is and what's in the catalog.
          </li>
          <li>
            <Link to="/writing">
              <strong>/writing</strong>
            </Link>{" "}
            — notes, articles, and user guides.
          </li>
          <li>
            <Link to="/company">
              <strong>/company</strong>
            </Link>{" "}
            — about the studio.
          </li>
          <li>
            <Link to="/contact">
              <strong>/contact</strong>
            </Link>{" "}
            — how to reach us.
          </li>
        </ul>
      </section>
    </TerminalShell>
  );
}
