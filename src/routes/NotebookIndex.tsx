import { Link } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import {
  latestNotebookEpisode,
  notebookIntro,
  notebookSeasons,
} from "../content/loader";

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

export function NotebookIndex() {
  const hasContent = notebookSeasons.length > 0;
  const totalEpisodes = notebookSeasons.reduce(
    (sum, s) => sum + s.episodes.length,
    0,
  );
  const latest = latestNotebookEpisode;

  const greeting =
    notebookIntro?.greeting ??
    "The Tessera Notebook — a daily platform-engineering story.";

  return (
    <TerminalShell chromeTitle="notebook">
      <section className="lh__section" aria-labelledby="notebook-intro">
        <p className="lh__greeting" id="notebook-intro">
          {greeting}
        </p>
        <hr className="lh__rule" />
        {notebookIntro ? (
          <Markdown source={notebookIntro.body} variant="page" />
        ) : (
          <>
            <p>
              A fictional engineering team at a fictional company called{" "}
              <strong>Tessera</strong> — a multi-tenant developer-infrastructure
              SaaS. We follow Tessera as it grows (POC → MVP → 10K → 1M → 10M →
              beyond) and watch the team navigate the platform-engineering
              problems that arrive at each scale tier.
            </p>
            <p>
              One episode a day. Three scene types alternate by feel:{" "}
              <span className="lh__scene-badge lh__scene-badge--feature">
                FEATURE
              </span>{" "}
              ships,{" "}
              <span className="lh__scene-badge lh__scene-badge--incident">
                INCIDENT
              </span>{" "}
              postmortems,{" "}
              <span className="lh__scene-badge lh__scene-badge--support">
                SUPPORT
              </span>{" "}
              escalations, and{" "}
              <span className="lh__scene-badge lh__scene-badge--decision">
                DECISION
              </span>{" "}
              rooms. The concept of the day is whatever the scene needed.
            </p>
            <p>
              <em>
                There is no finale. Seasons end when their conceptual scaffold
                is complete, not on a fixed count.
              </em>
            </p>
          </>
        )}
      </section>
      {latest ? (
        <section className="lh__section" aria-labelledby="notebook-latest">
          <div className="lh__sep" id="notebook-latest">
            ── <strong>LATEST</strong> ──────────────────────────────────────────────────
          </div>
          <Link
            to={`/notebook/${latest.season}/${latest.slug}`}
            className="lh__ep-hero"
            data-scene={latest.sceneType}
            aria-label={`Latest episode: Day ${latest.episode}, ${latest.title}`}
          >
            <span className="lh__ep-hero__head">
              <span className="lh__ep-hero__day">
                Day {String(latest.episode).padStart(2, "0")}
              </span>
              <span
                className={`lh__scene-badge lh__scene-badge--${latest.sceneType}`}
              >
                {SCENE_LABEL[latest.sceneType] ?? latest.sceneType.toUpperCase()}
              </span>
              {latest.date ? (
                <time className="lh__ep-hero__date" dateTime={latest.date}>
                  {formatDate(latest.date)}
                </time>
              ) : null}
            </span>
            <h2 className="lh__ep-hero__title">{latest.title}</h2>
            {latest.description ? (
              <p className="lh__ep-hero__desc">{latest.description}</p>
            ) : null}
            <span className="lh__ep-hero__cta">read this episode →</span>
          </Link>
        </section>
      ) : null}
      <section className="lh__section" aria-labelledby="notebook-seasons">
        <div className="lh__sep" id="notebook-seasons">
          ── <strong>SEASONS</strong> ──────────────────────────────────────────────────
        </div>
        {!hasContent ? (
          <p>
            <em>No episodes published yet — first episode lands soon.</em>
          </p>
        ) : (
          <>
            <p className="lh__post-meta">
              <time>{totalEpisodes}</time>{" "}
              {totalEpisodes === 1 ? "episode" : "episodes"} across{" "}
              <time>{notebookSeasons.length}</time>{" "}
              {notebookSeasons.length === 1 ? "season" : "seasons"}.
            </p>
            <ul className="lh__list lh__list--linkable" aria-label="Notebook seasons">
              {notebookSeasons.map((season) => (
                <li key={season.season}>
                  <Link
                    className="lh__card-link"
                    to={`/notebook/${season.season}`}
                    aria-label={`Open ${season.label}, ${season.episodes.length} ${season.episodes.length === 1 ? "episode" : "episodes"}`}
                  >
                    <strong>{season.label}</strong>
                    <br />
                    {season.description}
                    <span className="lh__season-meta">
                      {season.episodes.length}{" "}
                      {season.episodes.length === 1 ? "episode" : "episodes"} published
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </TerminalShell>
  );
}
