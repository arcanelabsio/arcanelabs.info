import { TerminalShell } from "../components/TerminalShell";

const ASCII = ` █████╗ ██████╗  ██████╗ █████╗ ███╗   ██╗███████╗    ██╗      █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝    ██║     ██╔══██╗██╔══██╗██╔════╝
███████║██████╔╝██║     ███████║██╔██╗ ██║█████╗      ██║     ███████║██████╔╝███████╗
██╔══██║██╔══██╗██║     ██╔══██║██║╚██╗██║██╔══╝      ██║     ██╔══██║██╔══██╗╚════██║
██║  ██║██║  ██║╚██████╗██║  ██║██║ ╚████║███████╗    ███████╗██║  ██║██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝`;

export function Home() {
  return (
    <TerminalShell chromeTitle="home">
      <section className="lh__section">
        <h1 className="lh__hero" aria-label="Arcane Labs">
          <pre className="lh__ascii" aria-hidden="true">
            {ASCII}
          </pre>
        </h1>
        <p className="lh__greeting">
          An independent software studio. Privacy-first, local-first software.
        </p>
        <hr className="lh__rule" />
        <p>
          <em>Phase-1 scaffold.</em> Content migrates to{" "}
          <code>content/pages/home.md</code> in phase 2; markdown pipeline
          lights up in phase 3.
        </p>
      </section>
    </TerminalShell>
  );
}
