import { Link } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { notebookSeasons } from "../content/loader";

export function NotebookIndex() {
  const hasContent = notebookSeasons.length > 0;
  const totalEpisodes = notebookSeasons.reduce(
    (sum, s) => sum + s.episodes.length,
    0,
  );

  return (
    <TerminalShell chromeTitle="notebook">
      <section className="lh__section" aria-labelledby="notebook-intro">
        <p className="lh__greeting" id="notebook-intro">
          The Tessera Notebook — a daily platform-engineering story.
        </p>
        <hr className="lh__rule" />
        <p>
          A fictional engineering team at a fictional company called{" "}
          <strong>Tessera</strong> — a multi-tenant developer-infrastructure SaaS.
          We follow Tessera as it grows (POC → MVP → 10K → 1M → 10M → beyond) and
          watch the team navigate the platform-engineering problems that arrive at
          each scale tier.
        </p>
        <p>
          One episode a day. Three scene types alternate by feel:{" "}
          <span className="lh__scene-badge lh__scene-badge--feature">FEATURE</span>{" "}
          ships,{" "}
          <span className="lh__scene-badge lh__scene-badge--incident">INCIDENT</span>{" "}
          postmortems,{" "}
          <span className="lh__scene-badge lh__scene-badge--support">SUPPORT</span>{" "}
          escalations, and{" "}
          <span className="lh__scene-badge lh__scene-badge--decision">DECISION</span>{" "}
          rooms. The concept of the day is whatever the scene needed.
        </p>
        <p>
          <em>
            There is no finale. Seasons end when their conceptual scaffold is
            complete, not on a fixed count.
          </em>
        </p>
      </section>
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
