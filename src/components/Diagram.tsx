import { useEffect, useId, useRef, useState } from "react";
import plantumlEncoder from "plantuml-encoder";

type Props = {
  type: "mermaid" | "plantuml";
  source: string;
};

// Single dispatch for inline diagrams. Mermaid renders client-side
// (lazy-loaded to keep the main bundle lean), PlantUML is encoded
// and served as SVG from kroki.io — no Java runtime, no bundle cost
// beyond the ~1KB encoder. SSR emits a pre-rendered fallback.
export function Diagram({ type, source }: Props) {
  if (type === "plantuml") {
    return <PlantUml source={source} />;
  }
  return <Mermaid source={source} />;
}

function PlantUml({ source }: { source: string }) {
  const encoded = plantumlEncoder.encode(source.trim());
  const url = `https://kroki.io/plantuml/svg/${encoded}`;
  return (
    <figure className="lh__diagram lh__diagram--plantuml">
      <img
        src={url}
        alt="PlantUML diagram"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

// Mermaid is big (~700KB gz) and mutates the DOM, so we only import
// it once the component mounts, once per page. The server render
// emits a terminal-styled placeholder so the layout doesn't jump on
// hydrate.
function Mermaid({ source }: { source: string }) {
  const id = useId().replace(/:/g, "_");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, source.trim());
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  return (
    <figure className="lh__diagram lh__diagram--mermaid" ref={ref}>
      {error ? (
        <pre className="lh__diagram__error">mermaid error: {error}</pre>
      ) : svg ? (
        <div
          className="lh__diagram__svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <pre className="lh__diagram__source" aria-label="mermaid source">
          {source.trim()}
        </pre>
      )}
    </figure>
  );
}
