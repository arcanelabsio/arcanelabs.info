import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import yaml from "highlight.js/lib/languages/yaml";
import dart from "highlight.js/lib/languages/dart";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import { Diagram } from "./Diagram";

// Explicit language registry — rehype-highlight only ships what we
// import, which drops ~150 KB gz vs. the default "common" bundle.
const HIGHLIGHT_LANGUAGES = {
  bash,
  javascript,
  js: javascript,
  typescript,
  ts: typescript,
  yaml,
  yml: yaml,
  dart,
  makefile,
  make: makefile,
  markdown,
  md: markdown,
  json,
  xml,
  html: xml,
};

export type MarkdownVariant = "page" | "post" | "project";

type Props = {
  source: string;
  // "page"   — home / company / contact. h2 renders as terminal separator.
  // "post"   — long-form writing. h2 renders as post section heading.
  // "project"— project detail. h2 renders as normal section heading.
  variant?: MarkdownVariant;
};

// react-markdown passes the raw AST node as a `node` prop to every
// custom component. We drop it here so it never leaks into the DOM
// as `<tag node="[object Object]">`.
type MarkdownNodeProps<T extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T> & { node?: unknown };

// Internal links (same-origin, starting with `/`) route through the
// SPA router for instant soft nav. Anchor links (#id) and external
// links fall through to plain <a>.
function LinkOrAnchor(props: MarkdownNodeProps<"a">) {
  const { href, children, node: _n, ...rest } = props;
  void _n;
  if (href && href.startsWith("/")) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

// Intercept fenced code blocks for mermaid/plantuml and delegate to
// Diagram. Everything else stays as whatever rehype-highlight
// produced. Inline code falls through to default <code> rendering.
function CodeRenderer(props: MarkdownNodeProps<"code">) {
  const { className, children, node: _n } = props;
  void _n;
  const lang = /language-(\w+)/.exec(className ?? "")?.[1];
  if (lang === "mermaid" || lang === "plantuml") {
    const source = Array.isArray(children)
      ? children.join("")
      : typeof children === "string"
        ? children
        : "";
    return <Diagram type={lang} source={source} />;
  }
  return <code className={className}>{children}</code>;
}

// Fenced blocks come wrapped in <pre><code>…</code></pre>. When the
// inner code is a Diagram, we don't want the <pre> wrapper around
// it. Detect and unwrap.
function PreRenderer(props: MarkdownNodeProps<"pre">) {
  const { children, node: _n, ...rest } = props;
  void _n;
  const child = Array.isArray(children) ? children[0] : children;
  if (
    child &&
    typeof child === "object" &&
    "props" in child &&
    typeof (child as { props: { className?: string } }).props.className ===
      "string"
  ) {
    const cn = (child as { props: { className: string } }).props.className;
    if (cn.includes("language-mermaid") || cn.includes("language-plantuml")) {
      return <>{children}</>;
    }
  }
  return <pre {...rest}>{children}</pre>;
}

// On page-variant pages, h2 renders as the terminal-style separator
// instead of a heading — preserving the aesthetic of the old
// hand-authored .lh__sep divs without leaking layout classes into
// markdown content.
function pageH2(props: MarkdownNodeProps<"h2">) {
  const { children, id, node: _n } = props;
  void _n;
  return (
    <div className="lh__sep" id={id}>
      ── <strong>{children}</strong> ──────────────────────────────────────
    </div>
  );
}

function componentsFor(variant: MarkdownVariant): Components {
  const base: Components = {
    a: LinkOrAnchor,
    code: CodeRenderer,
    pre: PreRenderer,
  };
  if (variant === "page") base.h2 = pageH2;
  return base;
}

export function Markdown({ source, variant = "post" }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkFrontmatter]}
      rehypePlugins={[
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap" }],
        [
          rehypeHighlight,
          {
            ignoreMissing: true,
            detect: false,
            languages: HIGHLIGHT_LANGUAGES,
          },
        ],
      ]}
      components={componentsFor(variant)}
    >
      {source}
    </ReactMarkdown>
  );
}
