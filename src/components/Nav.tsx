import { Fragment, useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/writing", label: "Writing", end: false },
  { to: "/company", label: "Company", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="lh__nav" aria-label="Primary">
      <div className="lh__nav-header">
        <Link to="/" className="lh__nav-brand">
          arcanelabs
        </Link>
        <button
          className="lh__nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? "✕" : "≡"}
        </button>
      </div>
      <div
        id="nav-links"
        className={`lh__nav-links${open ? " is-open" : ""}`}
      >
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
