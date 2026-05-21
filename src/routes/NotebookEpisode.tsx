import { Link, useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import { getNotebookEpisode, getNotebookSeason } from "../content/loader";
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

export function NotebookEpisode() {
  const { season, slug } = useParams<{ season: string; slug: string }>();
  const ep = getNotebookEpisode(season, slug);
  if (!ep) return <NotFound />;

  const seasonInfo = getNotebookSeason(season);
  const allEpisodes = seasonInfo?.episodes ?? [];
  const idx = allEpisodes.findIndex((e) => e.slug === ep.slug);
  const prev = idx > 0 ? allEpisodes[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < allEpisodes.length - 1 ? allEpisodes[idx + 1] : undefined;

  const sceneTag = SCENE_LABEL[ep.sceneType] ?? ep.sceneType.toUpperCase();
  const padded = String(ep.episode).padStart(2, "0");

  return (
    <TerminalShell chromeTitle={`Day ${ep.episode} — ${ep.title}`}>
      <article className="lh__post" aria-labelledby="episode-title">
        <header className="lh__post__head">
          <span className="lh__post__crumb">
            notebook / {ep.season} / day-{padded}.md
          </span>
          {ep.date ? (
            <time className="lh__post__date" dateTime={ep.date}>
              {formatDate(ep.date)}
            </time>
          ) : null}
        </header>
        <div className="lh__post__body">
          <h1 className="lh__post__title" id="episode-title">
            Day {ep.episode} — {ep.title}
          </h1>
          {ep.description && (
            <p className="lh__post__sub">{ep.description}</p>
          )}
          <div
            className="lh__ep-meta"
            role="group"
            aria-label="Episode metadata"
          >
            <span className="lh__ep-meta__item">
              <span
                className={`lh__scene-badge lh__scene-badge--${ep.sceneType}`}
                aria-label={`Scene type: ${sceneTag.toLowerCase()}`}
              >
                {sceneTag}
              </span>
            </span>
            {ep.arc ? (
              <span className="lh__ep-meta__item">
                <span className="lh__ep-meta__label">arc</span>
                <span className="lh__ep-meta__value">{ep.arc}</span>
              </span>
            ) : null}
            {ep.concept ? (
              <span className="lh__ep-meta__item">
                <span className="lh__ep-meta__label">concept</span>
                <span className="lh__ep-meta__value">
                  <strong>{ep.concept}</strong>
                </span>
              </span>
            ) : null}
          </div>
          <div className="lh__post__content">
            <Markdown source={ep.body} variant="post" />
          </div>
        </div>
      </article>

      <nav className="lh__ep-nav" aria-label="Episode navigation">
        {prev ? (
          <Link
            to={`/notebook/${prev.season}/${prev.slug}`}
            className="lh__ep-nav__slot lh__ep-nav__slot--prev"
            aria-label={`Previous episode: Day ${prev.episode}, ${prev.title}`}
          >
            <span className="lh__ep-nav__dir">← previous</span>
            <span className="lh__ep-nav__title">
              Day {prev.episode} — {prev.title}
            </span>
          </Link>
        ) : (
          <span
            className="lh__ep-nav__slot lh__ep-nav__slot--prev lh__ep-nav__slot--empty"
            aria-hidden="true"
          >
            <span className="lh__ep-nav__dir">← previous</span>
            <span className="lh__ep-nav__title">— first episode —</span>
          </span>
        )}
        {next ? (
          <Link
            to={`/notebook/${next.season}/${next.slug}`}
            className="lh__ep-nav__slot lh__ep-nav__slot--next"
            aria-label={`Next episode: Day ${next.episode}, ${next.title}`}
          >
            <span className="lh__ep-nav__dir">next →</span>
            <span className="lh__ep-nav__title">
              Day {next.episode} — {next.title}
            </span>
          </Link>
        ) : (
          <span
            className="lh__ep-nav__slot lh__ep-nav__slot--next lh__ep-nav__slot--empty"
            aria-hidden="true"
          >
            <span className="lh__ep-nav__dir">next →</span>
            <span className="lh__ep-nav__title">— latest episode —</span>
          </span>
        )}
      </nav>

      <p className="lh__backlink">
        <Link to={`/notebook/${ep.season}`}>~/notebook/{ep.season}</Link>
        {" · "}
        <Link to="/notebook">~/notebook</Link>
      </p>
    </TerminalShell>
  );
}
