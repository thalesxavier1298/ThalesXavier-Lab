import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  GraduationCap,
  Workflow,
  Layers,
  Palette,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import { useCopy } from "../context";
import { config } from "../config";
import { projects, education, experience, skills } from "../data";
import { Button, Heading, Photo, Card } from "../components/common";
import { ServiceDemo, HubDemo, Gallery } from "../components/demos";
export function Home() {
  const { t, tr, lang } = useCopy();
  return (
    <>
      <section className="hero wrap">
        <div>
          <span className="eyebrow">
            <i />
            {t.eyebrow}
          </span>
          <h1>
            Thales Serra
            <br />
            Xavier<span className="blue">.</span>
          </h1>
          <h2>{t.tag}</h2>
          <p className="intro">{t.intro}</p>
          <div className="actions">
            <Button to="/projects">{t.explore}</Button>
            <Button secondary to="/about">
              {t.about}
            </Button>
            <Link className="text-link" to="/contact">
              {t.contact} <ArrowUpRight size={16} />
            </Link>
            {config.resume && (
              <a href={config.resume} className="text-link">
                {lang === "pt" ? "Currículo" : "Résumé"}
              </a>
            )}
          </div>
          <div className="hero-meta">
            <span>
              <MapPin size={14} /> Alexandria, Louisiana
            </span>
            <span>
              <GraduationCap size={16} /> LSUA · 2027
            </span>
          </div>
        </div>
        <Photo />
      </section>
      <section className="featured wrap">
        <div className="feature-visual">
          <Workflow size={34} />
          <div className="flow">
            <span>01</span>
            <b>→</b>
            <span>02</span>
            <b>→</b>
            <span>03</span>
          </div>
          <small>{t.workflow}</small>
        </div>
        <div>
          <span className="eyebrow">01 / {t.featured}</span>
          <h2>{tr(projects[0].title)}</h2>
          <p>{tr(projects[0].overview)}</p>
          <div className="actions">
            <Button to="/projects/customer-service-automation">
              {t.study}
            </Button>
            <Link
              className="text-link"
              to="/projects/customer-service-automation#demo"
            >
              {t.demo}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section">
        <div className="section-title">
          <span className="eyebrow">01 — {t.areas}</span>
          <h2>{t.areas}</h2>
        </div>
        <div className="expertise">
          {[Workflow, Layers, Palette].map((Icon, i) => (
            <article key={i}>
              <Icon />
              <span className="index">0{i + 1}</span>
              <h3>{t.expertise[i]}</h3>
              <p>{t.expertiseText[i]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap section">
        <div className="section-title row">
          <h2>{t.selected}</h2>
          <Link to="/projects" className="text-link">
            {t.all}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <Card key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
      <section className="wrap section foundation">
        <div>
          <span className="eyebrow">{t.academic}</span>
          <h2>
            Louisiana State University
            <br />
            of Alexandria
          </h2>
          <p>{tr(education[0].title)}</p>
          <p>{tr(education[0].date)} · GPA 3.93 / 4.00</p>
          <Button secondary to="/education">
            {t.nav[2]}
          </Button>
        </div>
        <div>
          <span className="eyebrow">{t.nav[3]}</span>
          <h2>{tr(experience[0].title)}</h2>
          <p>Koube Química do Brasil / SuperSAC</p>
          <p>{tr(experience[0].date)}</p>
          <Button secondary to="/experience">
            {t.nav[3]}
          </Button>
        </div>
      </section>
      <Contact compact />
    </>
  );
}
export function About() {
  const { t } = useCopy();
  return (
    <section className="wrap section">
      <Heading title={t.about} />
      <div className="about-grid">
        <div>
          {t.aboutText.map((p) => (
            <p className="large-copy" key={p}>
              {p}
            </p>
          ))}
          <div className="facts">
            <span>{t.origin}</span>
            <span>{t.location}</span>
            <span>{t.languages}</span>
          </div>
          <Button to="/contact">{t.contact}</Button>
        </div>
        <Photo />
      </div>
    </section>
  );
}
export function Timeline({ type }) {
  const { t, tr } = useCopy();
  const ed = type === "education";
  return (
    <section className="wrap section">
      <Heading title={ed ? t.nav[2] : t.nav[3]} />
      <div className="timeline">
        {(ed ? education : experience).map((v, i) => (
          <article key={v.name}>
            <div className="timeline-date">
              <span className="index">0{i + 1}</span>
              {tr(v.date)}
            </div>
            <div>
              <span className="eyebrow">{v.name}</span>
              <h2>{tr(v.title)}</h2>
              <p>{tr(v.details)}</p>
              {v.items && (
                <ul>
                  {tr(v.items).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
      {ed && (
        <div className="panel athletic-section">
          <div className="athletic-copy">
            <h2>{t.athletic}</h2>
            <p>{t.athleteText}</p>
            <ul>
              {t.athletes.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <figure className="athletic-photo">
            {config.athleticPhoto ? (
              <img src={config.athleticPhoto} alt={t.athleticPhotoAlt} loading="lazy" width="740" height="1600" />
            ) : (
              <div className="athletic-photo-placeholder">
                <span aria-hidden="true">TX</span>
                <p>{t.athleticPhotoPlaceholder}</p>
              </div>
            )}
            <figcaption>{t.athleticPhotoCaption}</figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
export function Skills() {
  const { t, tr } = useCopy();
  return (
    <section className="wrap section">
      <Heading title={t.nav[4]} />
      <div className="expertise">
        {skills.map((s) => (
          <article key={tr(s.title)}>
            <h2>{tr(s.title)}</h2>
            <ul className="skill-list">
              {tr(s.items).map((v) => (
                <li key={v}>
                  <Check size={16} />
                  {v}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="panel">
        <h2>{t.recognition}</h2>
        <ul>
          {t.recognitions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export function Projects() {
  const { t, lang } = useCopy();
  const [filter, setFilter] = useState("all");
  return (
    <section className="wrap section">
      <Heading title={t.nav[5]}>
        <p>{t.intro}</p>
      </Heading>
      <article className="panel" style={{marginBottom:32,background:"linear-gradient(120deg, #152c40, #285748)",color:"#ecf5ef",padding:"clamp(24px, 5vw, 56px)"}}>
        <span className="eyebrow" style={{color:"#a5e5cf"}}>{lang === "pt" ? "NOVO · JOGO NO NAVEGADOR" : "NEW · BROWSER GAME"}</span>
        <h2 style={{fontSize:"clamp(30px, 5vw, 52px)",margin:"16px 0"}}>Jarvis: Skybound</h2>
        <p style={{color:"#cadfd9",maxWidth:650}}>{lang === "pt" ? "Uma aventura de plataforma original: 15 fases, uma torre, um castelo e cinco poderes. Explore o mapa e enfrente o Rei da Tempestade." : "An original platform adventure: 15 levels, a tower, a castle, and five powers. Explore the world map and face the Storm King."}</p>
        <a className="button" href="/jarvis/" style={{marginTop:16,background:"#f7cd69",color:"#183b42"}}>{lang === "pt" ? "Jogar agora" : "Play Jarvis"} <ArrowUpRight size={17}/></a>
      </article>
      <div className="filters">
        {["all", "ai", "content", "productivity"].map((v, i) => (
          <button
            key={v}
            className={filter === v ? "selected" : ""}
            aria-pressed={filter === v}
            onClick={() => setFilter(v)}
          >
            {t.filters[i]}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {projects.map((p, i) =>
          filter === "all" || p.group === filter ? (
            <Card p={p} i={i} key={p.id} heading="h2" />
          ) : null,
        )}
      </div>
    </section>
  );
}
export function CaseStudy() {
  const { id } = useParams();
  const { t, tr } = useCopy();
  const p = projects.find((p) => p.id === id);
  useEffect(() => {
    if (location.hash === "#demo")
      setTimeout(() => document.getElementById("demo")?.scrollIntoView(), 50);
  }, [id]);
  if (!p) return <NotFound />;
  return (
    <section className="wrap section">
      <Link className="text-link" to="/projects">
        ← {t.back}
      </Link>
      <Heading eyebrow={tr(p.category)} title={tr(p.title)}>
        <span className="status">
          <i />
          {tr(p.status)}
        </span>
        <p>
          {tr(p.date)}
          {p.org && ` · ${p.org}`}
        </p>
      </Heading>
      <div className="case-grid">
        <div>
          {["overview", "challenge", "approach", "role"].map((k) => (
            <section className="case-section" key={k}>
              <h2>{t[k]}</h2>
              <p>{tr(p[k])}</p>
            </section>
          ))}
          <section className="case-section">
            <h2>{t.features}</h2>
            <ul>
              {tr(p.features).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section className="case-section">
            <h2>{t.result}</h2>
            <p>{tr(p.result)}</p>
          </section>
        </div>
        <aside className="panel">
          <h2>{t.tools}</h2>
          <div className="tags">
            {p.tools.map((s, i) => (
              <span key={i}>{tr(s)}</span>
            ))}
          </div>
          <div className="media-placeholder">
            <Layers />
            <p>{t.placeholder}</p>
          </div>
          {config.demos[id] ? (
            <a className="button" href={config.demos[id]}>
              {t.live}
              <ArrowUpRight size={16} />
            </a>
          ) : id === "daily-planner" ? (
            <p>{t.soon}</p>
          ) : null}
        </aside>
      </div>
      <div id="demo">
        {id === "customer-service-automation" && <ServiceDemo />}
        {id === "assignment-hub" && <HubDemo />}
        {id === "social-media-content" && <Gallery />}
        {id === "ai-video-clipping" && (
          <div className="panel">
            <h2>{t.concept}</h2>
            <ol className="concept-flow">
              {t.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <Link className="text-link back" to="/projects">
        ← {t.back}
      </Link>
    </section>
  );
}
function PhoneContacts() {
  const { t } = useCopy();
  return <dl className="contact-phones">{config.phones.map(phone => (
    <div key={phone.labelKey}>
      <dt>{t[phone.labelKey]}</dt>
      <dd><a href={phone.href} aria-label={t[phone.labelKey] + ": " + phone.display}><Phone size={18} aria-hidden="true" />{phone.display}</a></dd>
    </div>
  ))}</dl>;
}
export function Contact({ compact = false }) {
  const { t } = useCopy();
  return (
    <section
      className={compact ? "contact-section" : "wrap section contact-page"}
    >
      {compact ? (
        <div className="wrap">
          <span className="eyebrow">{t.nav[6]}</span>
          <h2>{t.connect}</h2>
          <p>{t.connectText}</p>
          <a className="button" href={"mailto:" + config.email}>
            {t.email}
            <ArrowUpRight size={17} />
          </a>
          <PhoneContacts />
        </div>
      ) : (
        <>
          <Heading title={t.connect} />
          <p className="large-copy">{t.connectText}</p>
          <div className="contact-details">
            <h2>Thales Serra Xavier</h2>
            <p>
              <MapPin size={18} />
              {t.location}
            </p>
            <a className="email-link" href={"mailto:" + config.email}>
              <Mail />
              {config.email}
            </a>
            <PhoneContacts />
            <a className="button" href={"mailto:" + config.email}>
              {t.email}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </>
      )}
    </section>
  );
}
export function NotFound() {
  const { t } = useCopy();
  return (
    <section className="wrap section">
      <Heading eyebrow="404" title={t.notfound} />
      <p>{t.notfoundText}</p>
      <Button to="/">{t.home}</Button>
    </section>
  );
}
