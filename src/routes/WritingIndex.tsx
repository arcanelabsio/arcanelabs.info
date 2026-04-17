import { Link } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { posts } from "../content/loader";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(iso: string): string {
  try {
    return DATE_FMT.format(new Date(iso));
  } catch {
    return iso;
  }
}

export function WritingIndex() {
  return (
    <TerminalShell chromeTitle="writing">
      <section className="lh__section">
        <p className="lh__greeting">Notes, articles, and user guides.</p>
        <hr className="lh__rule" />
        <p>
          Occasional writing about the projects in the catalog — design
          decisions, user guides for the libraries, and what we're learning as
          we build. Read in any order.
        </p>
      </section>
      <section className="lh__section">
        <div className="lh__sep">
          ── <strong>POSTS</strong> ──────────────────────────────────────────────────
        </div>
        {posts.length === 0 ? (
          <p>
            <em>Nothing published yet — first pieces are on the way.</em>
          </p>
        ) : (
          <ul className="lh__list lh__list--linkable">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link className="lh__card-link" to={`/writing/${post.slug}`}>
                  <strong>{post.title}</strong>
                  {post.description ? ` — ${post.description}` : null}
                  <br />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </TerminalShell>
  );
}
