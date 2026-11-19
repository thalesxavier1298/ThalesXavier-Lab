import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ProjectCard } from '../components/ProjectCard'
import { projects, type ProjectFilter } from '../data/projects'
import { useI18n } from '../i18n'
import { ArrowUpRight, Gamepad2 } from 'lucide-react'
import { GAME_URL, cx, fmt } from '../lib/utils'

const filters: Array<ProjectFilter | 'all'> = ['all', 'automation', 'apps', 'content']

export function Work() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<ProjectFilter | 'all'>('all')
  const list = projects.filter((p) => filter === 'all' || p.filter === filter)

  return (
    <div className="shell pb-24 pt-32 md:pb-32 md:pt-44">
      <header className="grid gap-8 md:grid-cols-12">
        <h1 className="t-mega md:col-span-7">{t.work.title}</h1>
        <p className="t-lede max-w-[44ch] self-end md:col-span-5">{t.work.intro}</p>
      </header>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <div role="group" aria-label={t.work.filterLabel} className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cx(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                filter === f ? 'border-text bg-text text-bg' : 'border-line-strong text-muted hover:text-text',
              )}
            >
              {t.work.filters[f]}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {list.length === 1 ? t.work.countOne : fmt(t.work.count, { n: list.length })}
        </p>
      </div>

      <motion.ul layout className="mt-8 grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => {
            const wide = p.featured && filter === 'all'
            return (
              <motion.li
                layout
                key={p.slug}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className={cx('flex', wide && 'md:col-span-2')}
              >
                <div className="flex w-full flex-col [&>article]:flex-1">
                  <ProjectCard project={p} wide={wide} />
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      {/* A personal side project: links out to the game on the live site */}
      <aside aria-labelledby="game-title" className="mt-16 grid gap-6 rounded-2xl border border-dashed border-line-strong p-6 md:grid-cols-12 md:items-center md:gap-10 md:p-10">
        <div className="md:col-span-8">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Gamepad2 size={16} className="text-accent" />
            {t.game.label}
          </p>
          <h2 id="game-title" className="t-lg mt-3">{t.game.title}</h2>
          <p className="mt-3 max-w-[56ch] text-muted">{t.game.body}</p>
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <a
            href={GAME_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[0.95rem] font-medium transition-colors hover:border-text"
          >
            {t.game.cta}
            <ArrowUpRight size={17} className="text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </aside>
    </div>
  )
}
