import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp, ArrowUpRight, Check, Copy, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n'
import { EMAIL, GITHUB_URL, PHONES, fmt, scrollToId } from '../lib/utils'
import { Anchor, Reveal, SectionHead } from './ui'
import { Monogram } from './Nav'

/* ── Skills ─────────────────────────────────────────────────── */

export function SkillsSection({ id = 'skills' }: { id?: string }) {
  const { t } = useI18n()
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHead id={`${id}-title`} title={t.skills.title} intro={t.skills.intro} />
      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        {t.skills.categories.map((cat, i) => (
          <Reveal key={cat.title} delay={0.05 * i} className="flex flex-col gap-6 bg-bg p-6 md:p-10">
            <div>
              <h3 className="t-md">{cat.title}</h3>
              <p className="mt-2 max-w-[42ch] text-muted">{cat.body}</p>
            </div>
            <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5">
              {cat.items.map((item) => (
                <li key={item} className="text-[0.95rem]">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ── Process (a real sequence, so it is numbered) ───────────── */

export function ProcessSection() {
  const { t } = useI18n()
  return (
    <section aria-labelledby="process-title" className="shell py-24 md:py-36">
      <SectionHead id="process-title" title={t.home.processTitle} intro={t.home.processIntro} />
      <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* the route line connecting the steps */}
        <svg aria-hidden className="absolute left-[11px] top-3 hidden h-px w-[calc(100%-22px)] overflow-visible md:block" preserveAspectRatio="none">
          <motion.line
            x1="0" y1="0" x2="100%" y2="0"
            className="stroke-accent" strokeWidth="1.5" strokeDasharray="4 6"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        </svg>
        {t.home.process.map((step, i) => (
          <Reveal as="li" key={step.title} delay={0.12 * i} className="relative flex gap-5 md:flex-col md:gap-6">
            <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full border border-accent bg-bg font-mono text-[0.7rem] text-accent">
              {i + 1}
            </span>
            <div>
              <h3 className="t-md">{step.title}</h3>
              <p className="mt-3 max-w-[34ch] text-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ── Contact ────────────────────────────────────────────────── */

export function ContactSection() {
  const { t } = useI18n()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
    window.setTimeout(() => setCopyState('idle'), 2600)
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-16 border-t border-line bg-surface">
      <div className="shell py-24 md:py-36">
        <Reveal>
          <h2 id="contact-title" className="t-mega max-w-[13ch]">
            {t.contact.title}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="t-lede max-w-[44ch]">{t.contact.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Anchor href={`mailto:${EMAIL}`}>
                {t.contact.emailCta}
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Anchor>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-[0.95rem] text-muted transition-colors hover:text-text"
              >
                {copyState === 'copied' ? <Check size={16} className="text-ok" /> : <Copy size={16} />}
                <span className="select-all">{EMAIL}</span>
                <span className="sr-only">{t.contact.copy}</span>
              </button>
            </div>
            <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm text-muted">
              {copyState === 'copied' ? t.contact.copied : copyState === 'failed' ? t.contact.copyFailed : ''}
            </p>
          </div>

          <dl className="grid content-start gap-px overflow-hidden rounded-2xl border border-line bg-line md:col-span-5">
            {(
              [
                { label: t.contact.phoneUS, value: <a href={PHONES.us.href} className="tabular-nums hover:text-accent">{PHONES.us.display}</a> },
                { label: t.contact.phoneBR, value: <a href={PHONES.br.href} className="tabular-nums hover:text-accent">{PHONES.br.display}</a> },
                {
                  label: t.contact.githubLabel,
                  value: (
                    <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                      thalesxavier1298
                      <ArrowUpRight size={14} />
                    </a>
                  ),
                },
                { label: t.contact.linkedinLabel, value: <span className="text-muted">{t.contact.linkedinPending}</span> },
                { label: t.contact.locationLabel, value: <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{t.hero.location}</span> },
              ] as Array<{ label: string; value: ReactNode }>
            ).map((row) => (
              <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-surface px-5 py-4">
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="text-right text-[0.95rem]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram />
          <span className="flex flex-col">
            <span className="text-text">{t.footer.tagline}</span>
            <span>{fmt(t.footer.rights, { year: YEAR })}</span>
          </span>
        </div>
        <p className="max-w-[52ch]">{t.footer.note}</p>
        <button
          type="button"
          onClick={() => scrollToId('top')}
          className="inline-flex items-center gap-2 self-start rounded-full py-1 hover:text-text md:self-auto"
        >
          <ArrowUp size={15} />
          {t.footer.top}
        </button>
      </div>
    </footer>
  )
}
