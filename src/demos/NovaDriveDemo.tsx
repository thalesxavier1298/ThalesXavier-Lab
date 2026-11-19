import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, Headset, MessageSquare, RotateCcw, SendHorizontal } from 'lucide-react'
import { useI18n } from '../i18n'
import type { Dictionary } from '../i18n/en'
import { cx, fmt } from '../lib/utils'

/*
 * NovaDrive Auto Parts: a fictional customer-service flow.
 * Everything lives in component state and is discarded on restart or
 * unmount. No network calls, no storage. Messages and events store
 * translation keys (not strings) so switching language re-renders them.
 */

type Nova = Dictionary['nova']
type MsgKey = keyof Nova['msg']
type OptKey = keyof Nova['options']
type EventKey = keyof Nova['events']
type Kind = keyof Nova['monitor']['kinds']
type Ref = { group: 'queues' | 'values' | 'categories'; key: string }
type Params = Record<string, string | number | Ref>

type Step = 'idle' | 'busy' | 'customer' | 'segment' | 'consent' | 'name' | 'email' | 'request' | 'done'
type Queue = keyof Nova['queues']
type Category = keyof Nova['categories']

interface Message {
  id: number
  from: 'bot' | 'user' | 'agent' | 'system'
  key?: MsgKey
  option?: OptKey
  text?: string
  params?: Params
}
interface LogEvent {
  id: number
  at: number
  kind: Kind
  key: EventKey
  params?: Params
}
interface Session {
  status?: 'returning' | 'new'
  segment?: 'individual' | 'reseller'
  consent?: 'granted' | 'declined'
  category?: Category
  queue?: Queue
  name?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const KEYWORDS: Array<[Category, RegExp]> = [
  ['order', /\b(order|tracking|track|shipping|shipped|delivery|deliver)|pedido|rastre|entrega|frete|envio/i],
  ['returns', /\b(return|refund|warranty|defect|broken|damaged)|devolu|devolv|troca|garantia|defeito|reembolso|quebrad/i],
  ['quote', /\b(quote|price|pricing|bulk|discount|wholesale)|orçamento|orcamento|preço|preco|cotação|cotacao|desconto|atacado/i],
  ['parts', /\b(part|parts|fit|fits|brake|filter|engine|battery|tire|compatib)|peça|peca|freio|filtro|motor|pastilha|bateria|pneu|compat/i],
]

function classify(text: string): Category {
  for (const [cat, re] of KEYWORDS) if (re.test(text)) return cat
  return 'general'
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(2, user.length - 1))}@${domain}`
}

function clock(ms: number): string {
  const s = ms / 1000
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`
}

export function NovaDriveDemo() {
  const { t } = useI18n()
  const n = t.nova

  const [step, setStep] = useState<Step>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [events, setEvents] = useState<LogEvent[]>([])
  const [session, setSession] = useState<Session>({})
  const [typing, setTyping] = useState<'bot' | 'agent' | null>(null)
  const [draft, setDraft] = useState('')

  const ids = useRef(0)
  const startedAt = useRef(0)
  const timers = useRef<number[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLOListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  // Keep the newest message/event in view by scrolling the panel, never the page.
  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [events])

  // Return focus to the text field whenever the flow asks for typing.
  useEffect(() => {
    if (step === 'name' || step === 'email' || step === 'request') inputRef.current?.focus({ preventScroll: true })
  }, [step])

  const say = useCallback((m: Omit<Message, 'id'>) => setMessages((list) => [...list, { ...m, id: ++ids.current }]), [])
  const log = useCallback(
    (kind: Kind, key: EventKey, params?: Params) =>
      setEvents((list) => [...list, { id: ++ids.current, at: performance.now() - startedAt.current, kind, key, params }]),
    [],
  )

  /** Run steps with cumulative delays while showing a typing indicator. */
  const script = useCallback((who: 'bot' | 'agent', items: Array<[number, () => void]>, then?: () => void) => {
    setTyping(who)
    let total = 0
    items.forEach(([delay, run], i) => {
      total += delay
      timers.current.push(
        window.setTimeout(() => {
          run()
          if (i === items.length - 1) {
            setTyping(null)
            then?.()
          }
        }, total),
      )
    })
  }, [])

  /* ── Flow ──────────────────────────────────────────────── */

  const start = () => {
    startedAt.current = performance.now()
    setStep('busy') // locks input while the bot greets
    log('session', 'started')
    script('bot', [
      [500, () => { say({ from: 'bot', key: 'welcome' }); log('bot', 'greeted') }],
      [900, () => { say({ from: 'bot', key: 'askCustomer' }); log('bot', 'askedStatus') }],
    ], () => setStep('customer'))
  }

  const choose = (option: OptKey) => {
    say({ from: 'user', option })
    if (step === 'customer') {
      const status = option === 'yes' ? 'returning' : 'new'
      setSession((s) => ({ ...s, status }))
      setStep('busy')
      log('input', 'status', { value: { group: 'values', key: status } })
      script('bot', [[700, () => { say({ from: 'bot', key: 'askSegment' }); log('bot', 'askedSegment') }]], () => setStep('segment'))
    } else if (step === 'segment') {
      const segment = option === 'reseller' ? 'reseller' : 'individual'
      const queue: Queue = segment === 'reseller' ? 'reseller' : 'retail'
      setSession((s) => ({ ...s, segment, queue }))
      setStep('busy')
      log('input', 'segment', { value: { group: 'values', key: segment } })
      log('route', 'queueDraft', { queue: { group: 'queues', key: queue } })
      script('bot', [[700, () => { say({ from: 'bot', key: 'askConsent' }); log('privacy', 'askedConsent') }]], () => setStep('consent'))
    } else if (step === 'consent') {
      setStep('busy')
      if (option === 'consentYes') {
        setSession((s) => ({ ...s, consent: 'granted' }))
        log('privacy', 'consentGranted')
        script('bot', [[650, () => say({ from: 'bot', key: 'askName' })]], () => setStep('name'))
      } else {
        setSession((s) => ({ ...s, consent: 'declined' }))
        log('privacy', 'consentDeclined')
        log('privacy', 'contactSkipped')
        script('bot', [
          [650, () => say({ from: 'bot', key: 'consentSkipped' })],
          [700, () => say({ from: 'bot', key: 'askRequest' })],
        ], () => setStep('request'))
      }
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setDraft('')
    say({ from: 'user', text })

    if (step === 'name') {
      const name = text.slice(0, 40)
      setSession((s) => ({ ...s, name }))
      setStep('busy')
      log('data', 'name')
      script('bot', [[650, () => say({ from: 'bot', key: 'askEmail', params: { name } })]], () => setStep('email'))
    } else if (step === 'email') {
      setStep('busy')
      if (!EMAIL_RE.test(text)) {
        log('data', 'emailInvalid')
        script('bot', [[600, () => say({ from: 'bot', key: 'invalidEmail' })]], () => setStep('email'))
        return
      }
      log('data', 'email', { masked: maskEmail(text) })
      script('bot', [[650, () => say({ from: 'bot', key: 'askRequest' })]], () => setStep('request'))
    } else if (step === 'request') {
      const category = classify(text)
      const queue: Queue = session.queue ?? 'retail'
      setSession((s) => ({ ...s, category }))
      setStep('busy')
      log('input', 'request', { n: text.length })
      script('bot', [
        [500, () => log('triage', 'category', { category: { group: 'categories', key: category } })],
        [450, () => log('route', 'routed', { queue: { group: 'queues', key: queue } })],
        [500, () => { say({ from: 'bot', key: 'transferring', params: { queue: { group: 'queues', key: queue } } }); log('handoff', 'handoff') }],
      ], () => {
        script('agent', [
          [1300, () => log('handoff', 'assigned', { queue: { group: 'queues', key: queue } })],
          [1300, () => {
            say({ from: 'agent', key: 'agentJoined', params: { name: session.name ? ` ${session.name}` : '' } })
            log('handoff', 'joined')
          }],
          [900, () => { say({ from: 'system', key: 'ended' }); log('session', 'closed') }],
        ], () => setStep('done'))
      })
    }
  }

  const restart = () => {
    clearTimers()
    setMessages([])
    setEvents([])
    setSession({})
    setTyping(null)
    setDraft('')
    setStep('idle')
  }

  /* ── Rendering helpers ─────────────────────────────────── */

  const resolve = (params?: Params): Record<string, string | number> => {
    const out: Record<string, string | number> = {}
    for (const [k, v] of Object.entries(params ?? {})) {
      if (typeof v === 'object') {
        const group = v.group === 'values' ? n.monitor.values : v.group === 'queues' ? n.queues : n.categories
        out[k] = (group as Record<string, string>)[v.key] ?? v.key
      } else out[k] = v
    }
    return out
  }

  const msgText = (m: Message) => (m.text ? m.text : m.option ? n.options[m.option] : m.key ? fmt(n.msg[m.key], resolve(m.params)) : '')

  const options: OptKey[] =
    step === 'customer' ? ['yes', 'no'] : step === 'segment' ? ['individual', 'reseller'] : step === 'consent' ? ['consentYes', 'consentNo'] : []

  const inputEnabled = step === 'name' || step === 'email' || step === 'request'
  const placeholder =
    step === 'name' ? n.placeholders.name : step === 'email' ? n.placeholders.email : step === 'request' ? n.placeholders.request : step === 'done' ? n.placeholders.done : n.inputDisabled

  const v = n.monitor.values
  const summary: Array<[string, string | undefined]> = [
    [n.monitor.fields.status, session.status && v[session.status]],
    [n.monitor.fields.segment, session.segment && v[session.segment]],
    [n.monitor.fields.consent, session.consent && v[session.consent]],
    [n.monitor.fields.category, session.category && n.categories[session.category]],
    [n.monitor.fields.queue, session.queue && n.queues[session.queue]],
  ]

  const kindTone: Record<Kind, string> = {
    session: 'text-muted',
    bot: 'text-muted',
    input: 'text-text',
    data: 'text-warn',
    privacy: 'text-warn',
    triage: 'text-accent',
    route: 'text-accent',
    handoff: 'text-ok',
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Chat */}
      <div className="flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface lg:col-span-7">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-text font-display text-sm font-bold text-bg">ND</span>
            <div className="leading-tight">
              <p className="text-[0.95rem] font-medium">{n.brand}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span aria-hidden className={cx('size-1.5 rounded-full', step === 'idle' ? 'bg-faint' : 'bg-ok')} />
                {n.online}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-dashed border-line-strong px-2.5 py-1 text-[0.72rem] text-muted">{n.fictional}</span>
        </div>

        <div ref={chatRef} role="log" aria-live="polite" aria-label={n.chatTitle} className="relative flex h-[22rem] flex-col gap-3 overflow-y-auto px-4 py-5 md:h-[24rem]">
          {step === 'idle' && messages.length === 0 && (
            <div className="m-auto flex max-w-xs flex-col items-center gap-4 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
                <MessageSquare size={20} />
              </span>
              <p className="text-sm text-muted">{n.startHint}</p>
              <button type="button" onClick={start} className="rounded-full bg-text px-5 py-3 text-[0.95rem] font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink">
                {n.start}
              </button>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cx(
                  'flex max-w-[85%] flex-col gap-1',
                  m.from === 'user' ? 'self-end items-end' : m.from === 'system' ? 'self-center items-center' : 'self-start',
                )}
              >
                {(m.from === 'bot' || m.from === 'agent') && (
                  <span className="flex items-center gap-1.5 text-[0.72rem] text-muted">
                    {m.from === 'bot' ? <Bot size={12} /> : <Headset size={12} />}
                    {m.from === 'bot' ? n.bot : n.agent}
                  </span>
                )}
                <p
                  className={cx(
                    'rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-snug',
                    m.from === 'bot' && 'rounded-tl-sm bg-surface-2',
                    m.from === 'agent' && 'rounded-tl-sm border border-ok/40 bg-surface-2',
                    m.from === 'user' && 'rounded-tr-sm bg-accent text-accent-ink',
                    m.from === 'system' && 'border border-dashed border-line-strong text-center text-xs text-muted',
                  )}
                >
                  {m.from === 'user' && <span className="sr-only">{n.you}: </span>}
                  {msgText(m)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex items-center gap-1 self-start rounded-2xl bg-surface-2 px-3.5 py-3" aria-label={n.typing}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 rounded-full bg-muted" style={{ animation: `pulse-dot 1s ${i * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-line p-3">
          {options.length > 0 && !typing && (
            <div className="mb-3 flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => choose(o)}
                  className="rounded-full border border-accent/50 px-4 py-2 text-sm text-text transition-colors hover:bg-accent hover:text-accent-ink"
                >
                  {n.options[o]}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={submit} className="flex items-center gap-2">
            <label htmlFor="nova-input" className="sr-only">{placeholder}</label>
            <input
              id="nova-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!inputEnabled}
              placeholder={placeholder}
              autoComplete="off"
              maxLength={step === 'request' ? 400 : 80}
              type={step === 'email' ? 'email' : 'text'}
              className="h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 text-[0.95rem] placeholder:text-faint disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputEnabled || !draft.trim()}
              aria-label={n.send}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-text text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-40"
            >
              <SendHorizontal size={18} />
            </button>
            {step !== 'idle' && (
              <button
                type="button"
                onClick={restart}
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-muted hover:border-text hover:text-text"
              >
                <RotateCcw size={15} />
                <span className="hidden sm:inline">{n.restart}</span>
                <span className="sr-only sm:hidden">{n.restart}</span>
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Event monitor */}
      <aside aria-label={n.monitor.title} className="flex min-h-[34rem] flex-col overflow-hidden rounded-2xl border border-line-strong bg-bg lg:col-span-5">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-[0.95rem] font-medium">{n.monitor.title}</p>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span aria-hidden className={cx('size-1.5 rounded-full', step !== 'idle' && step !== 'done' ? 'bg-ok' : 'bg-faint')} style={step !== 'idle' && step !== 'done' ? { animation: 'pulse-dot 1.6s infinite' } : undefined} />
            {n.monitor.live}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-px border-b border-line bg-line">
          {summary.map(([label, value], i) => (
            <div key={label} className={cx('bg-bg px-4 py-2.5', i === summary.length - 1 && 'col-span-2')}>
              <dt className="text-[0.72rem] text-muted">{label}</dt>
              <dd className={cx('text-sm', value ? 'text-text' : 'text-faint')}>{value ?? v.pending}</dd>
            </div>
          ))}
        </dl>

        <ol ref={logRef} className="dotgrid flex h-[18rem] flex-1 flex-col gap-1 overflow-y-auto p-3 font-mono text-[0.75rem] lg:h-auto lg:max-h-[24rem]">
          {events.length === 0 && <li className="m-auto font-sans text-sm text-muted">{n.monitor.idle}</li>}
          <AnimatePresence initial={false}>
            {events.map((e) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-[4.2rem_1fr] gap-2 rounded-md bg-bg/90 px-2 py-1.5"
              >
                <span className="tabular-nums text-faint">{clock(e.at)}</span>
                <span>
                  <span className={cx('mr-2', kindTone[e.kind])}>{n.monitor.kinds[e.kind]}</span>
                  <span className="text-text">{fmt(n.events[e.key], resolve(e.params))}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </aside>
    </div>
  )
}
