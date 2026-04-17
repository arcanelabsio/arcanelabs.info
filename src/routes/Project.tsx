import { useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";

export function Project() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <TerminalShell chromeTitle={slug ?? "project"}>
      <section className="lh__section">
        <h1 className="lh__name">{slug}.</h1>
        <p className="lh__greeting">Phase-1 stub.</p>
        <hr className="lh__rule" />
        <p>
          Content renders from <code>content/projects/{slug}.md</code> once the
          markdown pipeline is wired (phase 3).
        </p>
      </section>
    </TerminalShell>
  );
}
