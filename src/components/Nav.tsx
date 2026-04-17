import { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/writing", label: "Writing", end: false },
  { to: "/company", label: "Company", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export function Nav() {
  return (
    <nav className="lh__nav" aria-label="Primary">
      <div className="lh__nav-links">
        <Link to="/" className="lh__nav-brand">
          arcanelabs
        </Link>
        {links.map((l, i) => (
          <Fragment key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? "is-current" : undefined
              }
            >
              {l.label}
            </NavLink>
            {i < links.length - 1 && (
              <span className="dot" aria-hidden="true">
                ·
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
