import React, { useState, useEffect } from "react";
import { Link, NavLink, Routes, Route, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { C } from "./context";
import { messages } from "./i18n";
import { projects } from "./data";
import { config } from "./config";
import {
  Home,
  About,
  Timeline,
  Skills,
  Projects,
  CaseStudy,
  Contact,
  NotFound,
} from "./pages/pages";
const paths = [
  "/",
  "/about",
  "/education",
  "/experience",
  "/skills",
  "/projects",
  "/contact",
];
const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
export default function App() {
  const [lang, setLang] = useState(() =>
    read("language", "en") === "pt" ? "pt" : "en",
  );
  const [theme, setTheme] = useState(() =>
    read(
      "theme",
      matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    ),
  );
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const t = messages[lang];
  const tr = (v) => (typeof v === "object" ? v[lang] : v);
  useEffect(() => {
    if (!menu) return;
    const close = (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        document.querySelector(".mobile-menu")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("language", lang);
      localStorage.setItem("theme", theme);
    } catch {}
  }, [lang, theme]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    const p = projects.find((p) => location.pathname.endsWith(p.id));
    const i = paths.indexOf(location.pathname);
    document.title = `${p ? tr(p.title) : i >= 0 ? t.nav[i] : "404"} | Thales Serra Xavier`;
    const desc = p ? tr(p.overview) : t.intro;
    document.querySelector('meta[name="description"]').content = desc;
    document.querySelector('meta[property="og:title"]').content =
      document.title;
    document.querySelector('meta[property="og:description"]').content = desc;
    document.getElementById("main")?.focus();
  }, [location.pathname, lang]);
  return (
    <C.Provider value={{ lang, t, tr }}>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <header>
        <div className="header-inner">
          <Link to="/" className="brand" aria-label={t.brandHome}>
            {t.brand}<span>.</span>
          </Link>
          <nav
            className={menu ? "open" : ""}
            aria-label={
              lang === "en" ? "Main navigation" : "Navegação principal"
            }
          >
            {paths.map((p, i) => (
              <NavLink key={p} to={p} end={p === "/"}>
                {t.nav[i]}
              </NavLink>
            ))}
          </nav>
          <div className="controls">
            <div className="languages">
              {["en", "pt"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={l === lang}
                  aria-label={l === "en" ? "English" : "Português brasileiro"}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="icon"
              aria-label={t.theme}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="icon mobile-menu"
              aria-label={t.menu}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/education" element={<Timeline type="education" />} />
          <Route path="/experience" element={<Timeline type="experience" />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<CaseStudy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <div>
          <Link to="/" className="brand" aria-label={t.brandHome}>
            {t.brand}<span>.</span>
          </Link>
          <p>{t.footer}</p>
        </div>
        <span>
          © {new Date().getFullYear()} Thales Serra Xavier. {t.rights}
        </span>
        <div className="socials">
          {config.github && <a href={config.github}>GitHub</a>}
          {config.linkedin && <a href={config.linkedin}>LinkedIn</a>}
        </div>
      </footer>
    </C.Provider>
  );
}
