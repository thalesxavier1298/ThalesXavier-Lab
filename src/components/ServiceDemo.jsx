import React, { useState } from "react";
import { Check } from "lucide-react";
import { useCopy } from "../context";

const copy = {
  en: {
    title: "Interactive service demo", note: "Fictional company · Browser-only simulation. Nothing is sent or saved. Use fictional information only.",
    greeting: "Hello! Welcome to NovaDrive Auto Parts. Let’s get your request to the right person.", existing: "Are you already a customer?", yes: "Yes", no: "No", type: "Are you buying as an individual or a business?", pf: "Individual (PF)", pj: "Business (PJ)", consent: "Would you like to include a fictional name and email? This is optional and does not affect service.", allow: "Yes, use sample details", skip: "Continue without details", name: "Fictional name (optional)", email: "Fictional email (optional)", next: "Continue", request: "What do you need? Describe a fictional parts request.", send: "Send sample request", handoff: "Your sample request has been routed to a human agent. This is a simulated handoff; no one has been contacted.", restart: "Restart demo", monitor: "Event monitor", empty: "Start the conversation to see workflow events.", start: "Start conversation", events: ["Conversation started", "Customer status selected", "Buyer type selected", "Optional details accepted", "Optional details skipped", "Sample details step completed", "Request received", "Routed to service queue", "Human handoff simulated"], placeholder: "Example: I need front brake pads for a fictional vehicle.", sample: "Demo Visitor", summary: "Sample request summary", anonymous: "No contact details", status: "Completed", count: "characters", consented: "Optional sample details enabled", skipped: "Contact details skipped"
  },
  pt: {
    title: "Demo interativa de atendimento", note: "Empresa fictícia · Simulação apenas no navegador. Nada é enviado ou salvo. Use somente informações fictícias.",
    greeting: "Olá! Bem-vindo à NovaDrive Auto Parts. Vamos encaminhar seu pedido à pessoa certa.", existing: "Você já é cliente?", yes: "Sim", no: "Não", type: "Você compra como pessoa física ou jurídica?", pf: "Pessoa física (PF)", pj: "Pessoa jurídica (PJ)", consent: "Deseja incluir nome e e-mail fictícios? É opcional e não interfere no atendimento.", allow: "Sim, usar dados de exemplo", skip: "Continuar sem dados", name: "Nome fictício (opcional)", email: "E-mail fictício (opcional)", next: "Continuar", request: "O que você precisa? Descreva um pedido fictício de autopeças.", send: "Enviar pedido de exemplo", handoff: "Seu pedido de exemplo foi encaminhado a um atendente. Esta transferência é simulada; ninguém foi contatado.", restart: "Reiniciar demo", monitor: "Monitor de eventos", empty: "Inicie a conversa para acompanhar os eventos do fluxo.", start: "Iniciar conversa", events: ["Conversa iniciada", "Situação do cliente selecionada", "Tipo de comprador selecionado", "Dados opcionais aceitos", "Dados opcionais dispensados", "Etapa de dados de exemplo concluída", "Pedido recebido", "Encaminhado à fila de atendimento", "Transferência humana simulada"], placeholder: "Exemplo: Preciso de pastilhas de freio dianteiras para um veículo fictício.", sample: "Visitante Demo", summary: "Resumo do pedido de exemplo", anonymous: "Sem dados de contato", status: "Concluído", count: "caracteres", consented: "Dados opcionais de exemplo habilitados", skipped: "Dados de contato dispensados"
  }
};

export function ServiceDemo() {
  const { lang } = useCopy();
  const c = copy[lang] || copy.en;
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [consent, setConsent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [events, setEvents] = useState([]);
  const log = (...ids) => setEvents(old => [...old, ...ids]);
  function reset() {
    setStep(0); setCustomer(null); setBuyer(null); setConsent(null);
    setName(""); setEmail(""); setRequest(""); setEvents([]);
  }
  return <section className="demo panel novadrive" aria-labelledby="novadrive-title">
    <span className="eyebrow">NovaDrive Auto Parts</span>
    <h2 id="novadrive-title">{c.title}</h2>
    <p>{c.note}</p>
    <div className="demo-grid">
      <div className="chat">
        <h3>NovaDrive Auto Parts</h3>
        <p className="bubble">{c.greeting}</p>
        {step === 0 && <button className="button" onClick={() => { setStep(1); log(0); }}>{c.start}</button>}
        <div aria-live="polite" aria-atomic="false">
          {step >= 1 && <p className="bubble">{c.existing}</p>}
          {customer !== null && <p className="bubble outgoing">{customer ? c.yes : c.no}</p>}
          {step >= 2 && <p className="bubble">{c.type}</p>}
          {buyer && <p className="bubble outgoing">{c[buyer]}</p>}
          {step >= 3 && <p className="bubble">{c.consent}</p>}
          {consent !== null && <p className="bubble outgoing">{consent ? c.consented : c.skipped}</p>}
          {step >= 5 && <p className="bubble">{c.request}</p>}
          {step === 6 && <><p className="bubble outgoing">{request}</p><p className="bubble" role="status">{c.handoff}</p></>}
        </div>
        {step === 1 && <div className="actions">{[true, false].map(value => <button key={String(value)} onClick={() => { setCustomer(value); setStep(2); log(1); }}>{value ? c.yes : c.no}</button>)}</div>}
        {step === 2 && <div className="actions">{["pf", "pj"].map(value => <button key={value} onClick={() => { setBuyer(value); setStep(3); log(2); }}>{c[value]}</button>)}</div>}
        {step === 3 && <div className="actions">
          <button onClick={() => { setConsent(true); setStep(4); log(3); }}>{c.allow}</button>
          <button onClick={() => { setConsent(false); setStep(5); log(4); }}>{c.skip}</button>
        </div>}
        {step === 4 && <form onSubmit={e => { e.preventDefault(); setStep(5); log(5); }} autoComplete="off">
          <label htmlFor="nova-name">{c.name}</label>
          <input id="nova-name" maxLength={60} value={name} placeholder={c.sample} onChange={e => setName(e.target.value)} />
          <label htmlFor="nova-email">{c.email}</label>
          <input id="nova-email" type="email" maxLength={100} value={email} placeholder="visitor@example.com" onChange={e => setEmail(e.target.value)} />
          <button className="button">{c.next}</button>
        </form>}
        {step === 5 && <form onSubmit={e => { e.preventDefault(); if (!request.trim()) return; setRequest(request.trim()); setStep(6); log(6, 7, 8); }}>
          <label htmlFor="nova-request">{c.request}</label>
          <textarea id="nova-request" rows={4} required maxLength={500} value={request} placeholder={c.placeholder} onChange={e => setRequest(e.target.value)} aria-describedby="nova-count" />
          <small id="nova-count">{request.length}/500 {c.count}</small>
          <button className="button" disabled={!request.trim()}>{c.send}</button>
        </form>}
      </div>
      <aside aria-labelledby="nova-monitor">
        <h3 id="nova-monitor">{c.monitor}</h3>
        {!events.length && <p>{c.empty}</p>}
        <ol className="event-list" aria-live="polite" aria-relevant="additions">{events.map((id, i) => <li key={id}><span><Check size={15} aria-hidden="true" /></span><div><small>{String(i + 1).padStart(2, "0")}</small>{c.events[id]}</div></li>)}</ol>
        {step === 6 && <div className="nova-summary"><h3>{c.summary}</h3><p>{customer ? c.yes : c.no} · {c[buyer]}</p><p>{name.trim() || email.trim() ? [name.trim(), email.trim()].filter(Boolean).join(" · ") : c.anonymous}</p><p>{request}</p><strong>{c.status} · DEMO-001</strong></div>}
      </aside>
    </div>
    <button onClick={reset}>{c.restart}</button>
  </section>;
}
