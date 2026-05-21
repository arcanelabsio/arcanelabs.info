import { Link, useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { getNotebookSeason } from "../content/loader";
import { NotFound } from "./NotFound";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return DATE_FMT.format(new Date(iso));
  } catch {
    return iso;
  }
}

const SCENE_LABEL: Record<string, string> = {
  feature: "FEATURE",
  incident: "INCIDENT",
  support: "SUPPORT",
  decision: "DECISION",
};

export function NotebookSeason() {
  const { season } = useParams<{ season: string }>();
  const data = getNotebookSeason(season);
  if (!data) return <NotFound />;

  return (
    <TerminalShell chromeTitle={data.label}>
      <section className="lh__section" aria-labelledby="season-intro">
        <p className="lh__greeting" id="season-intro">
          {data.label}
        </p>
        <hr className="lh__rule" />
        <p>{data.description}</p>
        <p>
          <Link to="/notebook" aria-label="Back to all seasons">
            ← all seasons
          </Link>
        </p>
      </section>
      <section className="lh__section" aria-labelledby="season-episodes">
        <div className="lh__sep" id="season-episodes">
          ── <strong>EPISODES</strong> ─────────────────────────────────────────────────
        </div>
        {data.episodes.length === 0 ? (
          <p>
            <em>No episodes yet in this season.</em>
          </p>
        ) : (
          <ul
            className="lh__list lh__list--linkable"
            aria-label={`Episodes in ${data.label}`}
          >
            {data.episodes.map((ep) => (
              <li key={ep.slug}>
                <Link
                  to={`/notebook/${ep.season}/${ep.slug}`}
                  className="lh__card-link lh__ep-card"
                  data-scene={ep.sceneType}
                  aria-label={`Day ${ep.episode}: ${ep.title}`}
                >
                  <span className="lh__ep-card__head">
                    <span className="lh__ep-card__num">
                      Day {String(ep.episode).padStart(2, "0")}
                    </span>
                    <span
                      className={`lh__scene-badge lh__scene-badge--${ep.sceneType}`}
                    >
                      {SCENE_LABEL[ep.sceneType] ?? ep.sceneType.toUpperCase()}
                    </span>
                    <span className="lh__ep-card__title">{ep.title}</span>
                  </span>
                  {ep.description ? (
                    <span className="lh__ep-card__desc">{ep.description}</span>
                  ) : null}
                  <span className="lh__ep-card__foot">
                    {ep.date ? (
                      <time dateTime={ep.date}>{formatDate(ep.date)}</time>
                    ) : null}
                    {ep.arc ? <em>{ep.arc}</em> : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </TerminalShell>
  );
}
