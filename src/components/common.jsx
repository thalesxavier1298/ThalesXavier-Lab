import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Workflow, Palette, Layers } from "lucide-react";
import { useCopy } from "../context";
import { config } from "../config";
export function Button({ to, children, secondary = false, ...props }) {
  return (
    <Link
      className={`button ${secondary ? "secondary" : ""}`}
      to={to}
      {...props}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Heading({ eyebrow, title, children }) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow || "THALES SERRA XAVIER"}</span>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
export function Photo() {
  const { t } = useCopy();
  return (
    <div className="portrait">
      {config.portrait ? (
        <img src={config.portrait} alt={t.portraitAlt} />
      ) : (
        <>
          <div className="portrait-lines" />
          <span className="portrait-monogram">
            TX<span>↗</span>
          </span>
          <span className="photo-label">{t.photo}</span>
        </>
      )}
      <div className="portrait-caption">
        <span>THALES SERRA XAVIER</span>
        <span>Alexandria, LA ↗</span>
      </div>
    </div>
  );
}
export function Card({ p, i, heading: Title = "h3" }) {
  const { t, tr } = useCopy();
  return (
    <article className="project-card">
      <Link
        to={"/projects/" + p.id}
        className={`project-art art-${i}`}
        aria-label={tr(p.title)}
      >
        <span className="art-number">0{i + 1}</span>
        {i === 0 ? <Workflow /> : i === 1 ? <Palette /> : <Layers />}
        <small>{t.placeholder}</small>
      </Link>
      <div className="card-content">
        <span className="eyebrow">{tr(p.category)}</span>
        <Title className="card-title">
          <Link to={"/projects/" + p.id}>{tr(p.title)}</Link>
        </Title>
        <p>{tr(p.overview)}</p>
        <span className="status">
          <i />
          {tr(p.status)}
        </span>
        <div className="tags">
          {p.tools.slice(0, 3).map((v, i) => (
            <span key={i}>{tr(v)}</span>
          ))}
        </div>
        <Link className="text-link" to={"/projects/" + p.id}>
          {t.study}
          <ArrowUpRight size={16} />
        </Link>
        {config.demos[p.id] ? (
          <a className="text-link" href={config.demos[p.id]}>
            {t.live}
          </a>
        ) : p.id === "daily-planner" ? (
          <small className="muted">{t.soon}</small>
        ) : null}
      </div>
    </article>
  );
}
