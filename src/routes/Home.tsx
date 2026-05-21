import { Link } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import { getPage, latestNotebookEpisode } from "../content/loader";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const SCENE_LABEL: Record<string, string> = {
  feature: "FEATURE",
  incident: "INCIDENT",
  support: "SUPPORT",
  decision: "DECISION",
};

const ASCII = ` █████╗ ██████╗  ██████╗ █████╗ ███╗   ██╗███████╗    ██╗      █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝    ██║     ██╔══██╗██╔══██╗██╔════╝
███████║██████╔╝██║     ███████║██╔██╗ ██║█████╗      ██║     ███████║██████╔╝███████╗
██╔══██║██╔══██╗██║     ██╔══██║██║╚██╗██║██╔══╝      ██║     ██╔══██║██╔══██╗╚════██║
██║  ██║██║  ██║╚██████╗██║  ██║██║ ╚████║███████╗    ███████╗██║  ██║██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝`;

export function Home() {
  const page = getPage("home");
  const latest = latestNotebookEpisode;
  return (
    <TerminalShell chromeTitle="home">
      <section className="lh__section">
        <h1 className="lh__hero" aria-label="Arcane Labs">
          <pre className="lh__ascii" aria-hidden="true">
            {ASCII}
          </pre>
        </h1>
        {page?.greeting && <p className="lh__greeting">{page.greeting}</p>}
        <hr className="lh__rule" />
        {latest ? (
          <section
            className="lh__section"
            aria-labelledby="home-notebook-latest"
            style={{ marginTop: 0 }}
          >
            <div className="lh__sep" id="home-notebook-latest">
              ── <strong>FROM THE NOTEBOOK</strong> ────────────────────────────────────────
            </div>
            <Link
              to={`/notebook/${latest.season}/${latest.slug}`}
              className="lh__ep-hero"
              data-scene={latest.sceneType}
              aria-label={`Latest notebook episode: Day ${latest.episode}, ${latest.title}`}
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
                    {DATE_FMT.format(new Date(latest.date))}
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
        <div className="prose">
          <Markdown source={page?.body ?? ""} variant="page" />
        </div>
      </section>
    </TerminalShell>
  );
}
