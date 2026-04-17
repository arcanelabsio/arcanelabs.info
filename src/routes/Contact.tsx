import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import { getPage } from "../content/loader";

export function Contact() {
  const page = getPage("contact");
  return (
    <TerminalShell chromeTitle="contact">
      <section className="lh__section">
        {page?.greeting && <p className="lh__greeting">{page.greeting}</p>}
        <hr className="lh__rule" />
        <div className="prose">
          <Markdown source={page?.body ?? ""} variant="page" />
        </div>
      </section>
    </TerminalShell>
  );
}
