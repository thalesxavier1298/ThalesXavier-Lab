import { useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import type { PreviewKind } from '../../data/projects'
import { useI18n } from '../../i18n'
import { cx } from '../../lib/utils'
import { useTicker } from './useTicker'
import { flyers } from '../../data/gallery'

/* Shared window frame for interface mockups. */
function Frame({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx('flex h-full flex-col overflow-hidden rounded-xl border border-line-strong bg-bg shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]', className)}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <span aria-hidden className="flex gap-1">
          <i className="size-2 rounded-full bg-line-strong" />
          <i className="size-2 rounded-full bg-line-strong" />
          <i className="size-2 rounded-full bg-line-strong" />
        </span>
        <span className="truncate text-[0.7rem] text-muted">{title}</span>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

/* ── Customer service: chat + event stream ─────────────────── */

function ServicePreview() {
  const { t } = useI18n()
  const step = useTicker(6, 1300)
  const chat = [
    { from: 'bot', text: t.nova.msg.askCustomer },
    { from: 'user', text: t.nova.options.yes },
    { from: 'bot', text: t.nova.msg.askSegment },
    { from: 'user', text: t.nova.options.reseller },
  ]
  const events = [
    t.nova.events.started,
    t.nova.events.askedStatus,
    t.nova.events.status.replace('{value}', t.nova.monitor.values.returning),
    t.nova.events.segment.replace('{value}', t.nova.monitor.values.reseller),
    t.nova.events.routed.replace('{queue}', t.nova.queues.reseller),
    t.nova.events.handoff,
  ]
  return (
    <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-5">
      <Frame title={t.nova.brand} className="sm:col-span-3">
        <div className="flex h-full flex-col justify-end gap-2 p-3">
          {chat.slice(0, Math.min(step + 1, 4)).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cx(
                'max-w-[85%] rounded-2xl px-3 py-2 text-[0.72rem] leading-snug',
                m.from === 'bot' ? 'self-start rounded-bl-sm bg-surface-2' : 'self-end rounded-br-sm bg-accent text-accent-ink',
              )}
            >
              {m.text}
            </motion.div>
          ))}
        </div>
      </Frame>
      <Frame title={t.nova.monitor.title} className="hidden sm:col-span-2 sm:flex">
        <ul className="flex flex-col gap-1.5 p-3 font-mono text-[0.62rem] leading-snug">
          {events.map((e, i) => (
            <li
              key={e}
              className={cx(
                'border-l-2 pl-2 transition-colors duration-500',
                i === step ? 'border-accent text-text' : i < step ? 'border-line-strong text-muted' : 'border-transparent text-faint/50',
              )}
            >
              {e}
            </li>
          ))}
        </ul>
      </Frame>
    </div>
  )
}

/* ── Social content: a fan of real flyers ──────────────────── */

function ContentPreview() {
  const fan = [
    { item: flyers[1], cls: 'h-[66%] -rotate-6 translate-x-6' },
    { item: flyers[2], cls: 'z-10 h-[88%]' },
    { item: flyers[0], cls: 'h-[66%] rotate-6 -translate-x-6' },
  ]
  return (
    <div className="flex h-full items-center justify-center">
      {fan.map(({ item, cls }) => (
        <img
          key={item.id}
          src={item.src}
          alt=""
          width={item.width}
          height={item.height}
          loading="lazy"
          className={cx('w-auto max-w-[40%] rounded-lg object-cover shadow-[0_24px_48px_-20px_rgb(0_0_0/0.6)] ring-1 ring-line', cls)}
        />
      ))}
    </div>
  )
}

/* ── Daily planner: tasks, points, week ────────────────────── */

function PlannerPreview({ interactive = false }: { interactive?: boolean }) {
  const { t } = useI18n()
  const pl = t.previews.planner
  const [done, setDone] = useState<boolean[]>([true, true, false, false])
  const points = done.filter(Boolean).length * 10 + 40
  const bars = [0.45, 0.7, 0.55, 0.85, 0.6, 0.25, 0.15]
  return (
    <Frame title="Daily Planner">
      <div className="grid h-full grid-cols-5 gap-3 p-3">
        <div className="col-span-3 flex flex-col gap-2">
          <p className="text-[0.72rem] font-medium">{pl.today}</p>
          <ul className="flex flex-col gap-1.5">
            {pl.tasks.map((task, i) => {
              const content = (
                <>
                  <span className={cx('grid size-3.5 shrink-0 place-items-center rounded-[4px] border', done[i] ? 'border-accent bg-accent text-accent-ink' : 'border-line-strong')}>
                    {done[i] && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className={cx('truncate', done[i] && 'text-faint line-through')}>{task}</span>
                </>
              )
              return (
                <li key={task}>
                  {interactive ? (
                    <button
                      type="button"
                      aria-pressed={done[i]}
                      onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                      className="flex w-full items-center gap-2 rounded-md bg-surface px-2 py-1.5 text-left text-[0.72rem] hover:bg-surface-2"
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md bg-surface px-2 py-1.5 text-[0.72rem]">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="mt-auto text-[0.68rem] text-muted">{pl.calendar}</p>
          <div className="flex gap-1.5">
            {pl.events.map((e, i) => (
              <span key={e} className={cx('truncate rounded-md px-2 py-1 text-[0.65rem]', i === 1 ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted')}>
                {e}
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-3 rounded-lg bg-surface p-2.5">
          <div>
            <p className="text-[0.65rem] text-muted">{pl.points}</p>
            <motion.p key={points} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="font-display text-2xl font-semibold tabular-nums">
              {points}
            </motion.p>
          </div>
          <div className="mt-auto">
            <p className="mb-1.5 text-[0.65rem] text-muted">{pl.week}</p>
            <div className="flex h-14 items-end gap-1" aria-hidden>
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className={cx('flex-1 rounded-sm', i === 3 ? 'bg-accent' : 'bg-line-strong')}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * i, duration: 0.5 }}
                />
              ))}
            </div>
            <div className="mt-1 flex gap-1 text-center text-[0.55rem] text-faint" aria-hidden>
              {pl.days.map((d, i) => <span key={i} className="flex-1">{d}</span>)}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── Assignment hub: compact week board (card only) ────────── */

function HubPreview() {
  const { t } = useI18n()
  const pulse = useTicker(4, 1400)
  const cells = [
    [0, 0], [1, 1], [2, 2], [2, 0], [3, 3], [4, 1], [4, 2], [5, 3],
  ]
  return (
    <Frame title={t.hub.appName}>
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5 overflow-hidden" aria-hidden>
          {t.hub.pipeline.map((s, i) => (
            <span key={s} className={cx('shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] transition-colors duration-500', i === pulse ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-muted')}>
              {s}
            </span>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-6 gap-1">
          {t.hub.days.slice(0, 6).map((d, col) => (
            <div key={d} className="flex flex-col gap-1 rounded-md bg-surface p-1">
              <span className="text-[0.58rem] text-faint">{d}</span>
              {cells.filter(([c]) => c === col).map(([, course], k) => (
                <span key={k} className={cx('h-4 rounded-sm', courseTone[course])} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

/** Course tones: accent plus neutral steps, readable in both themes. */
// eslint-disable-next-line react-refresh/only-export-components
export const courseTone = ['bg-accent', 'bg-text/70', 'bg-accent/45', 'bg-text/30']

/* ── Video editing timeline ────────────────────────────────── */

function VideoPreview() {
  const { t } = useI18n()
  const v = t.previews.video
  const clips = [
    [[2, 22], [24, 41], [43, 70], [72, 96]],
    [[6, 20], [26, 39], [47, 66], [75, 92]],
    [[2, 96]],
  ]
  return (
    <Frame title="Timeline">
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="flex gap-1" aria-hidden>
          {v.steps.map((s) => (
            <span key={s} className="flex-1 truncate rounded bg-surface-2 px-1.5 py-1 text-center text-[0.6rem] text-muted">{s}</span>
          ))}
        </div>
        <div className="relative flex flex-1 flex-col justify-center gap-1.5">
          {clips.map((row, r) => (
            <div key={r} className="flex items-center gap-2">
              <span className="w-12 shrink-0 truncate text-[0.6rem] text-faint">{v.tracks[r]}</span>
              <div className="relative h-5 flex-1 rounded bg-surface">
                {row.map(([a, b], k) => (
                  <span
                    key={k}
                    className={cx(
                      'absolute inset-y-0.5 rounded-sm',
                      r === 0 && 'bg-text/25',
                      r === 1 && 'bg-accent/60',
                      r === 2 && 'dotgrid bg-text/10',
                    )}
                    style={{ left: `${a}%`, width: `${b - a}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-14 right-0">
            <span className="absolute inset-y-0 w-px bg-accent" style={{ left: '30%', animation: 'playhead 6s linear infinite alternate' }} />
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── Dispatcher ────────────────────────────────────────────── */

export function ProjectPreview({ kind, large = false }: { kind: PreviewKind; large?: boolean }) {
  switch (kind) {
    case 'service':
      return <ServicePreview />
    case 'content':
      return <ContentPreview />
    case 'planner':
      return <PlannerPreview interactive={large} />
    case 'hub':
      return <HubPreview />
    case 'video':
      return <VideoPreview />
  }
}

