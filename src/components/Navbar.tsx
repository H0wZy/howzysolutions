import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export function Navbar() {
  const { t, locale, toggleLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: [string, string][] = [
    [t.nav.about, "about"],
    [t.nav.toolkit, "toolkit"],
    [t.nav.work, "projects"],
    [t.nav.contact, "contact"],
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#" data-scroll-to="hero" className="navbar-logo">
          <span className="navbar-cube" aria-hidden="true" />
          H0wZy<span className="navbar-logo-dim">.dev</span>
        </a>

        <nav className="navbar-links" aria-label="Primary">
          {links.map(([label, key]) => (
            <a key={key} href={`#${key}`} data-scroll-to={key} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            className="pill-toggle"
            onClick={toggleLocale}
            aria-label="Toggle language"
          >
            {locale === "en" ? "EN" : "PT"}
          </button>

          <button
            type="button"
            className="icon-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="navbar-mobile" aria-label="Mobile">
          {links.map(([label, key]) => (
            <a
              key={key}
              href={`#${key}`}
              data-scroll-to={key}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
