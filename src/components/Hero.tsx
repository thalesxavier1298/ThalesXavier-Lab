import { motion, useReducedMotion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { useI18n } from '../i18n'
import { Button, ButtonLink } from './ui'
import { scrollToId } from '../lib/utils'
import portrait from '../assets/thales-portrait.jpg'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The hero's one memorable move: the headline is literally "connected".
 * A route line in the gutter draws through a node at each line of type,
 * the same visual language used later for workflows and the demo.
 */
function RouteWire({ lines }: { lines: number }) {
  const reduce = useReducedMotion()
  const ys = Array.from({ length: lines }, (_, i) => ((i + 0.5) / lines) * 100)
  return (
    <svg aria-hidden viewBox="0 0 40 100" preserveAspectRatio="none" className="absolute inset-y-0 left-0 hidden h-full w-10 overflow-visible md:block">
      <motion.path
        d={`M 8 ${ys[0]} L 8 ${ys[ys.length - 1]}`}
        className="stroke-accent"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        fill="none"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.55, ease }}
      />
      {ys.map((y, i) => (
        <motion.line
          key={i}
          x1="8" x2="30" y1={y} y2={y}
          className="stroke-accent"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.75 + i * 0.28, ease }}
        />
      ))}
    </svg>
  )
}

function Nodes({ lines }: { lines: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 md:block">
      {Array.from({ length: lines }, (_, i) => (
        <motion.span
          key={i}
          className="absolute left-[8px] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-accent bg-bg"
          style={{ top: `${((i + 0.5) / lines) * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 + i * 0.28, duration: 0.35, ease }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const { t, lang } = useI18n()
  const lines = t.hero.headline

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 md:pt-36">
      {/* quiet depth: one soft field of the accent, no imagery */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[80vh] w-[80vw] rounded-full opacity-70"
        style={{ background: 'radial-gradient(closest-side, var(--accent-soft), transparent)' }}
      />

      <div className="shell relative">
        <motion.div
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[0.95rem] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-text">{t.hero.role}</p>
          <p>{t.hero.location}</p>
        </motion.div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end md:gap-8">
        <div className="relative md:col-span-8 md:pl-14">
          <RouteWire lines={lines.length} />
          <Nodes lines={lines.length} />
          {/* key on lang so the entrance replays gently on language change */}
          <h1 id="hero-title" key={lang} className="t-mega">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.08 + i * 0.09, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>
        <motion.figure
          className="w-full max-w-[18rem] md:col-span-4 md:max-w-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease }}
        >
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <img
              src={portrait}
              alt={t.hero.portraitAlt}
              width={828}
              height={1104}
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: '50% 32%' }}
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">Thales Serra Xavier</figcaption>
        </motion.figure>
        </div>

        <motion.div
          className="mt-12 grid gap-10 border-t border-line pb-16 pt-8 md:mt-16 md:grid-cols-12 md:pb-24"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
        >
          <div className="md:col-span-7">
            <p className="t-lede max-w-[40ch] text-text">{t.hero.statement}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => scrollToId('work')}>
                {t.hero.ctaWork}
                <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" />
              </Button>
              <ButtonLink to="/about" variant="ghost">
                {t.hero.ctaAbout}
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-sm text-muted">{t.hero.focusLabel}</p>
            <p className="mt-1 max-w-[32ch]">{t.hero.focus}</p>
            <p className="mt-2 text-sm tabular-nums text-accent">{t.hero.focusDetail}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
