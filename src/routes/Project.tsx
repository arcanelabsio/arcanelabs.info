import { useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import { getProject } from "../content/loader";
import { NotFound } from "./NotFound";

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

export function Project() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProject(slug);
  if (!project) return <NotFound />;

  return (
    <TerminalShell chromeTitle={project.name}>
      <section className="lh__section">
        <h1 className="lh__name">{project.name}.</h1>
        <p className="lh__greeting">{project.tagline}</p>
        <hr className="lh__rule" />
        <div className="prose">
          <Markdown source={project.body} variant="project" />
        </div>
      </section>

      {project.install && (
        <section className="lh__section">
          <h2>Install</h2>
          <pre>
            <code>{project.install}</code>
          </pre>
        </section>
      )}

      {project.release && (
        <section className="lh__section">
          <h2>Latest release</h2>
          <p className="lh__post-meta">
            <strong>{project.release.version}</strong>
            {project.release.date && (
              <>
                {" "}
                ·{" "}
                <time dateTime={project.release.date}>
                  {formatDate(project.release.date)}
                </time>
              </>
            )}
          </p>
          {project.release.notes && (
            <div className="prose">
              <Markdown source={project.release.notes} variant="project" />
            </div>
          )}
        </section>
      )}

      {project.links.length > 0 && (
        <section className="lh__section">
          <h2>Links</h2>
          <ul className="lh__list">
            {project.links.map((link) => (
              <li key={link.url}>
                <a href={link.url}>
                  <strong>{link.label}</strong>
                </a>
                {link.note ? ` — ${link.note}` : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </TerminalShell>
  );
}
