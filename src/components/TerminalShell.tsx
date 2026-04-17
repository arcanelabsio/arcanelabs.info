import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

type Props = {
  children: ReactNode;
  chromeTitle?: string;
};

export function TerminalShell({ children, chromeTitle = "home" }: Props) {
  const title = chromeTitle.length > 40 ? chromeTitle.slice(0, 40) : chromeTitle;
  return (
    <div className="lh">
      <div className="lh__chrome">
        <span className="lh__dot lh__dot--red" />
        <span className="lh__dot lh__dot--amber" />
        <span className="lh__dot lh__dot--green" />
        <span className="lh__chrome-title">
          <strong>arcanelabsio</strong> — zsh — {title}
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
