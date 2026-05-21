import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

type Props = {
  children: ReactNode;
  chromeTitle?: string;
  // 'quiet' tones down the chrome (no traffic-light dots, tighter padding)
  // on deep reading pages where the window frame shouldn't compete with
  // the prose — e.g. /notebook/:season/:slug episode bodies.
  chromeVariant?: "full" | "quiet";
};

export function TerminalShell({
  children,
  chromeTitle = "home",
  chromeVariant = "full",
}: Props) {
  const title = chromeTitle.length > 40 ? chromeTitle.slice(0, 40) : chromeTitle;
  const quiet = chromeVariant === "quiet";
  return (
    <div className="lh">
      <div className={`lh__chrome${quiet ? " lh__chrome--quiet" : ""}`}>
        {!quiet && (
          <>
            <span className="lh__dot lh__dot--red" />
            <span className="lh__dot lh__dot--amber" />
            <span className="lh__dot lh__dot--green" />
          </>
        )}
        <span className="lh__chrome-title">
          {quiet ? title : <><strong>arcanelabsio</strong> — zsh — {title}</>}
        </span>
      </div>
      <div className="lh__page">
        <Nav />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
