import { Link, useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <TerminalShell chromeTitle={slug ?? "post"}>
      <article className="lh__post">
        <div className="lh__post__head">
          <span className="lh__post__crumb">writing / {slug}.md</span>
        </div>
        <div className="lh__post__body">
          <h1 className="lh__post__title">{slug}</h1>
          <p className="lh__post__sub">
            Phase-1 stub. Content renders from{" "}
            <code>content/posts/{slug}.md</code> once the markdown pipeline is
            wired (phase 3).
          </p>
        </div>
      </article>
      <p className="lh__backlink">
        <Link to="/writing">~/writing</Link>
      </p>
    </TerminalShell>
  );
}
