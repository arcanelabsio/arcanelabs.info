export function Footer() {
  return (
    <footer className="lh__footer">
      <p>
        <span className="amber">[LOCATION]</span> Bengaluru, India
        <span className="dot">·</span>
        <span className="amber">[SOURCE]</span>{" "}
        <a href="https://github.com/arcanelabsio">github.com/arcanelabsio</a>
        <span className="dot">·</span>
        <span className="amber">[SOCIAL]</span>{" "}
        <a href="https://www.instagram.com/labs.arcane/">@labs.arcane</a>
        <span className="dot">·</span>
        <a href="https://x.com/LabsArcane">@LabsArcane</a>
        <span className="dot">·</span>
        <span className="amber">[CONTACT]</span>{" "}
        <a href="mailto:hello@arcanelabs.info">hello@arcanelabs.info</a>
      </p>
      <p>
        <span className="mint">© 2026</span> Arcane Labs
        <span className="dot">·</span>
        <span className="mint">[LICENSE]</span> MIT on published code
        <span className="dot">·</span>
        <span className="mint">[BUILD]</span> {BUILD_DATE}
      </p>
    </footer>
  );
}

// Injected by Vite `define` at build time; see vite.config.ts.
declare const BUILD_DATE: string;
