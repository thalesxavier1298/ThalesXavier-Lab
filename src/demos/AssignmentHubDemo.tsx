import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarCheck, Check, FileDown, ListChecks, RotateCcw, ScanSearch } from 'lucide-react'
import { useI18n } from '../i18n'
import type { Dictionary } from '../i18n/en'
import { cx, fmt } from '../lib/utils'
import { courseTone } from '../components/previews/Previews'

/* Fictional coursework. Titles come from the dictionary by index. */
type ItemType = keyof Dictionary['hub']['types']
const ITEMS: Array<{ course: number; day: number; type: ItemType }> = [
  { course: 0, day: 0, type: 'discussion' },
  { course: 1, day: 1, type: 'essay' },
  { course: 2, day: 2, type: 'project' },
  { course: 3, day: 2, type: 'discussion' },
  { course: 0, day: 3, type: 'quiz' },
  { course: 1, day: 4, type: 'project' },
  { course: 3, day: 4, type: 'discussion' },
  { course: 0, day: 6, type: 'essay' },
]

const pipelineIcons = [FileDown, ScanSearch, ListChecks, CalendarCheck]

export function AssignmentHubDemo() {
  const { t } = useI18n()
  const h = t.hub
  const [course, setCourse] = useState<number | null>(null)
  const [done, setDone] = useState<Set<number>>(() => new Set([0]))
  const [sync, setSync] = useState<'idle' | 'running' | 'done'>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const visible = ITEMS.map((it, i) => ({ ...it, i })).filter((it) => course === null || it.course === course)
  const open = visible.filter((it) => !done.has(it.i)).length
  const pipelineStage = sync === 'idle' ? 2 : sync === 'running' ? 2 : 3

  const toggle = (i: number) => {
    setSync('idle')
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const runSync = () => {
    setSync('running')
    timer.current = window.setTimeout(() => setSync('done'), 900)
  }

  const reset = () => {
    window.clearTimeout(timer.current)
    setCourse(null)
    setDone(new Set([0]))
    setSync('idle')
  }

  const days = h.days.map((label, d) => ({ label, items: visible.filter((it) => it.day === d) }))

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-surface">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
        <div className="flex items-baseline gap-3">
          <p className="font-display text-lg font-semibold">{h.appName}</p>
          <p className="text-sm text-muted">{h.week}</p>
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {fmt(h.remaining, { n: open })}
          <span aria-hidden className="mx-2 text-faint">/</span>
          {fmt(h.done, { n: visible.length - open })}
        </p>
      </div>

      {/* Pipeline: Moodle export → organize → review → Google Calendar */}
      <ol className="flex gap-2 overflow-x-auto border-b border-line px-4 py-3 md:px-5">
        {h.pipeline.map((label, i) => {
          const Icon = pipelineIcons[i]
          const state = i < pipelineStage ? 'past' : i === pipelineStage ? 'current' : 'future'
          return (
            <li key={label} className="flex shrink-0 items-center gap-2">
              <span
                className={cx(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors',
                  state === 'past' && 'bg-surface-2 text-text',
                  state === 'current' && 'bg-accent text-accent-ink',
                  state === 'future' && 'border border-dashed border-line-strong text-muted',
                )}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <Icon size={13} />
                {label}
              </span>
              {i < h.pipeline.length - 1 && <span aria-hidden className="h-px w-4 bg-line-strong" />}
            </li>
          )
        })}
      </ol>

      {/* Course filter */}
      <div role="group" aria-label={h.allCourses} className="flex flex-wrap gap-2 px-4 pt-4 md:px-5">
        {[null, 0, 1, 2, 3].map((c) => (
          <button
            key={c ?? 'all'}
            type="button"
            aria-pressed={course === c}
            onClick={() => { setCourse(c); setSync('idle') }}
            className={cx(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
              course === c ? 'border-text bg-text text-bg' : 'border-line-strong text-muted hover:text-text',
            )}
          >
            {c !== null && <span aria-hidden className={cx('size-2 rounded-full', courseTone[c])} />}
            {c === null ? h.allCourses : h.courses[c]}
          </button>
        ))}
      </div>

      {/* Week board */}
      <div className="grid gap-2 p-4 md:grid-cols-7 md:p-5">
        {days.map((day) => (
          <section
            key={day.label}
            aria-label={day.label}
            className={cx('flex flex-col gap-2 rounded-xl bg-bg p-2.5 md:min-h-44', day.items.length === 0 && 'hidden md:flex')}
          >
            <h4 className="text-xs font-medium text-muted">{day.label}</h4>
            <AnimatePresence mode="popLayout" initial={false}>
              {day.items.map((it) => {
                const isDone = done.has(it.i)
                const title = h.items[it.i]
                return (
                  <motion.button
                    layout
                    key={it.i}
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    onClick={() => toggle(it.i)}
                    aria-pressed={isDone}
                    aria-label={fmt(isDone ? h.markUndone : h.markDone, { title })}
                    className={cx(
                      'group flex flex-col gap-2 rounded-lg border p-2.5 text-left transition-colors',
                      isDone ? 'border-transparent bg-surface-2/60' : 'border-line bg-surface hover:border-line-strong',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={cx('h-1 w-6 rounded-full', courseTone[it.course])} aria-hidden />
                      <span
                        aria-hidden
                        className={cx(
                          'grid size-4 place-items-center rounded-full border',
                          isDone ? 'border-ok bg-ok text-bg' : 'border-line-strong group-hover:border-text',
                        )}
                      >
                        {isDone && <Check size={10} strokeWidth={3} />}
                      </span>
                    </span>
                    <span className={cx('text-[0.82rem] leading-snug', isDone && 'text-muted line-through')}>{title}</span>
                    <span className="text-[0.72rem] text-muted">{h.types[it.type]}</span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </section>
        ))}
        {visible.length > 0 && open === 0 && <p className="text-sm text-muted md:col-span-7">{h.empty}</p>}
      </div>

      {/* Sync simulation */}
      <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-3 md:px-5">
        <button
          type="button"
          onClick={runSync}
          disabled={sync === 'running' || open === 0}
          className="inline-flex items-center gap-2 rounded-full bg-text px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-40"
        >
          <CalendarCheck size={16} />
          {sync === 'running' ? h.syncing : h.syncCta}
        </button>
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-muted hover:text-text">
          <RotateCcw size={14} />
          {h.reset}
        </button>
        <p role="status" className="min-h-5 text-sm text-muted md:ml-auto">
          {sync === 'done' && fmt(h.syncResult, { n: open })}
        </p>
      </div>
    </div>
  )
}
