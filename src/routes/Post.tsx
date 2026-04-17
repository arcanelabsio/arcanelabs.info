import { Link, useParams } from "react-router-dom";
import { TerminalShell } from "../components/TerminalShell";
import { Markdown } from "../components/Markdown";
import { getPost } from "../content/loader";
import { NotFound } from "./NotFound";

const DATE_ISO = (iso: string) => iso;

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);
  if (!post) return <NotFound />;

  return (
    <TerminalShell chromeTitle={post.title}>
      <article className="lh__post">
        <div className="lh__post__head">
          <span className="lh__post__crumb">writing / {post.slug}.md</span>
          <time className="lh__post__date" dateTime={DATE_ISO(post.date)}>
            {post.date}
          </time>
        </div>
        <div className="lh__post__body">
          <h1 className="lh__post__title">{post.title}</h1>
          {post.description && (
            <p className="lh__post__sub">{post.description}</p>
          )}
          <div className="lh__post__content">
            <Markdown source={post.body} variant="post" />
          </div>
        </div>
      </article>
      <p className="lh__backlink">
        <Link to="/writing">~/writing</Link>
      </p>
    </TerminalShell>
  );
}
