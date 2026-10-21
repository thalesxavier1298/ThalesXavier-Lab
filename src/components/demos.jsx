import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Palette, X } from "lucide-react";
import { useCopy } from "../context";
import { galleryAssets } from "../config";
export function ServiceDemo() {
  const { t } = useCopy();
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [reason, setReason] = useState(null);
  const [name, setName] = useState("Alex Demo");
  const [events, setEvents] = useState(0);
  useEffect(() => {
    if (step !== 4 || events >= 6) return;
    const timer = setTimeout(() => setEvents((e) => e + 1), 650);
    return () => clearTimeout(timer);
  }, [step, events]);
  function reset() {
    setStep(0);
    setEvents(0);
    setCustomer(null);
    setReason(null);
    setName("Alex Demo");
  }
  return (
    <section className="demo panel">
      <span className="eyebrow">{t.safe}</span>
      <h2>{t.demo}</h2>
      <p>{t.demoNote}</p>
      <div className="demo-grid">
        <div className="chat">
          <h3>{t.chat} · Nova Demo</h3>
          {step === 0 ? (
            <button
              className="button"
              onClick={() => {
                setStep(1);
                setEvents(1);
              }}
            >
              {t.start}
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <p className="bubble">{t.existing}</p>
              {customer !== null && (
                <p className="bubble outgoing">{customer ? t.yes : t.no}</p>
              )}
              {step === 1 && (
                <div className="actions">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => {
                        setCustomer(v);
                        setStep(2);
                        setEvents(2);
                      }}
                    >
                      {v ? t.yes : t.no}
                    </button>
                  ))}
                </div>
              )}
              {step >= 2 && <p className="bubble">{t.reason}</p>}
              {reason !== null && (
                <p className="bubble outgoing">{t.reasons[reason]}</p>
              )}
              {step === 2 && (
                <div className="choices">
                  {t.reasons.map((v, i) => (
                    <button
                      key={v}
                      onClick={() => {
                        setReason(i);
                        setStep(3);
                        setEvents(3);
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
              {step === 3 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(4);
                  }}
                >
                  <label htmlFor="sample-name">{t.sample}</label>
                  <input
                    id="sample-name"
                    maxLength="50"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button className="button">
                    {t.submit}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
              {step === 4 && (
                <p className="bubble outgoing">
                  {name} · {t.reasons[reason]}
                </p>
              )}
              {events === 6 && (
                <p className="bubble" role="status">
                  {t.handoff}
                </p>
              )}
            </>
          )}
        </div>
        <div>
          <h3>{t.workflow}</h3>
          <ol className="event-list" aria-live="polite">
            {t.events.slice(0, events).map((s, i) => (
              <li key={s}>
                <span>
                  <Check size={15} />
                </span>
                <div>
                  {s}
                  {i === 3 && <small> DEMO-001 · {name}</small>}
                  {i === 4 && <small> Nova Demo · {t.reasons[reason]}</small>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <button onClick={reset}>{t.restart}</button>
    </section>
  );
}
export function HubDemo() {
  const { t, lang } = useCopy();
  const [course, setCourse] = useState("all");
  const [done, setDone] = useState([]);
  const [view, setView] = useState("list");
  const [notice, setNotice] = useState("");
  return (
    <section className="panel demo">
      <span className="eyebrow">{t.safe}</span>
      <h2>Assignment Hub · {t.sampleTitle}</h2>
      <p>{t.hubNote}</p>
      <div className="dashboard-toolbar">
        <label htmlFor="demo-course">
          {t.course}
          <select
            id="demo-course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            <option value="all">{t.allCourses}</option>
            {t.courses.map((s, i) => (
              <option value={i} key={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <div className="filters">
          {["list", "calendar"].map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              className={v === view ? "selected" : ""}
              onClick={() => setView(v)}
            >
              {t[v]}
            </button>
          ))}
        </div>
      </div>
      {view === "calendar" && (
        <div className="month-calendar">
          <h3>
            {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(Date.UTC(2026, 9, 1)))}
          </h3>
          <div className="month-grid">
            {Array.from({ length: 7 }, (_, i) => (
              <span className="weekday" key={"day" + i}>
                {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
                  weekday: "short",
                  timeZone: "UTC",
                }).format(new Date(Date.UTC(2026, 9, 4 + i)))}
              </span>
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <span
                className="empty-day"
                key={"empty" + i}
                aria-hidden="true"
              />
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const assignment = i - 25;
              const visible =
                assignment >= 0 &&
                assignment < 3 &&
                (course === "all" || Number(course) === assignment);
              return (
                <div className="month-day" key={i}>
                  <time dateTime={`2026-10-${String(i + 1).padStart(2, "0")}`}>
                    {i + 1}
                  </time>
                  {visible && (
                    <button
                      className={
                        done.includes(assignment)
                          ? "calendar-task done"
                          : "calendar-task"
                      }
                      aria-pressed={done.includes(assignment)}
                      aria-label={`${t.assignments[assignment]} — ${done.includes(assignment) ? t.undo : t.complete}`}
                      onClick={() =>
                        setDone((d) =>
                          d.includes(assignment)
                            ? d.filter((v) => v !== assignment)
                            : [...d, assignment],
                        )
                      }
                    >
                      {done.includes(assignment) && <Check size={13} />}
                      <span>{t.assignments[assignment]}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="assignment-list">
        {t.assignments.map((s, i) =>
          course === "all" || Number(course) === i ? (
            <article className={done.includes(i) ? "done" : ""} key={s}>
              <span className="eyebrow">{t.courses[i]}</span>
              <h3>{s}</h3>
              <p>
                {t.due}:{" "}
                {new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(Date.UTC(2026, 9, 26 + i)))}
              </p>
              <button
                aria-pressed={done.includes(i)}
                onClick={() =>
                  setDone((d) =>
                    d.includes(i) ? d.filter((v) => v !== i) : [...d, i],
                  )
                }
              >
                {done.includes(i) ? <Check size={16} /> : null}
                {done.includes(i) ? t.undo : t.complete}
              </button>
            </article>
          ) : null,
        )}
      </div>
      <div className="actions">
        <button onClick={() => setNotice("synced")}>{t.sync}</button>
        <button onClick={() => setNotice("notification")}>{t.notify}</button>
      </div>
      <p role="status">{notice && t[notice]}</p>
    </section>
  );
}
export function Gallery() {
  const { t, tr } = useCopy();
  const [type, setType] = useState("flyer");
  const [active, setActive] = useState(null);
  const [slide, setSlide] = useState(0);
  const dialog = useRef();
  const trigger = useRef();
  const types = ["flyer", "carousel", "video", "thumbnail"];
  const items = galleryAssets.filter((x) => x.type === type);
  function open(item, e) {
    trigger.current = e.currentTarget;
    setActive(item);
    setSlide(0);
    dialog.current.showModal();
  }
  function close() {
    dialog.current.close();
    setActive(null);
    trigger.current?.focus();
  }
  return (
    <section className="panel">
      <h2>{t.gallery}</h2>
      <p>{t.volume}</p>
      <div className="filters">
        {types.map((v, i) => (
          <button
            key={v}
            className={v === type ? "selected" : ""}
            aria-pressed={v === type}
            onClick={() => setType(v)}
          >
            {t.galleryFilters[i]}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {items.length
          ? items.map((item) => (
              <button
                className="gallery-item"
                key={item.id}
                onClick={(e) => open(item, e)}
              >
                {item.type === "video" ? (
                  <span>{tr(item.title)} ▶</span>
                ) : (
                  <img src={item.src || item.slides?.[0]} alt={tr(item.alt)} />
                )}
                <span>{tr(item.title)}</span>
              </button>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} className="gallery-placeholder">
                <Palette />
                <span>
                  {t.galleryFilters[types.indexOf(type)]} 0{i + 1}
                </span>
                <small>{t.placeholder}</small>
              </div>
            ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="gallery-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <button className="dialog-close" onClick={close} aria-label={t.close}>
          <X />
        </button>
        <h2 id="gallery-title">{active && tr(active.title)}</h2>
        {active &&
          (active.type === "video" ? (
            <video key={active.src} src={active.src} controls />
          ) : (
            <img
              src={active.slides?.[slide] || active.src}
              alt={tr(active.alt)}
            />
          ))}
        {active?.slides?.length > 1 && (
          <div className="actions">
            <button
              onClick={() =>
                setSlide(
                  (s) => (s - 1 + active.slides.length) % active.slides.length,
                )
              }
            >
              {t.prev}
            </button>
            <span>
              {slide + 1} / {active.slides.length}
            </span>
            <button
              onClick={() => setSlide((s) => (s + 1) % active.slides.length)}
            >
              {t.next}
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
