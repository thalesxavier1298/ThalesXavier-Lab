import { motion } from 'motion/react'
import { ArrowRight, Award } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, Tag } from '../components/ui'
import { useSectionNav } from '../lib/useSectionNav'
import portrait from '../assets/thales-portrait.jpg'
import trophy from '../assets/thales-soccer-trophy.jpg'
import logoRmpus from '../assets/teams/rmpus.png'
import logoMcc from '../assets/teams/mcc-tribunes.png'
import logoScu from '../assets/teams/scu-eagles.png'

/** Team marks, in the same order as about.athletes. */
const teamLogos = [logoRmpus, logoMcc, logoScu]

const ease = [0.22, 1, 0.36, 1] as const

/** Label column + content column, the editorial rhythm of this page. */
function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="shell mt-20 grid gap-6 md:mt-28 md:grid-cols-12 md:gap-10">
      <h2 id={id} className="t-md border-t border-line pt-8 md:col-span-4 md:sticky md:top-28 md:self-start">
        {title}
      </h2>
      <div className="md:col-span-8 md:border-t md:border-line md:pt-8">{children}</div>
    </section>
  )
}

export function About() {
  const { t } = useI18n()
  const a = t.about
  const goSection = useSectionNav()
  const selectedSkills = ['ChatGPT', 'n8n', 'Flow Builder', 'Supabase', 'OpenAI API', 'WhatsApp Business API', 'Google AI Studio', 'Canva', 'CapCut']

  return (
    <div className="pb-24 pt-32 md:pb-32 md:pt-44">
      {/* Opening: statement + portrait */}
      <section className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col md:col-span-7">
          <motion.h1 className="t-mega" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            {a.title}
          </motion.h1>
          <motion.p
            className="t-lg mt-10 max-w-[26ch] font-normal md:mt-14"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {a.intro}
          </motion.p>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 md:mt-auto">
            {a.facts.map((f) => (
              <div key={f.label} className="bg-bg px-4 py-3">
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="mt-0.5 text-[0.95rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <motion.figure
          className="md:col-span-4 md:col-start-9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        >
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <img
              src={portrait}
              alt={a.portraitAlt}
              width={828}
              height={1104}
              className="aspect-[4/5] w-full object-cover grayscale-[15%]"
              style={{ objectPosition: '50% 35%' }}
            />
          </div>
          <figcaption className="mt-3 flex justify-between gap-4 text-sm text-muted">
            <span className="text-text">Thales Serra Xavier</span>
            <span>{t.hero.location}</span>
          </figcaption>
        </motion.figure>
      </section>

      <Block id="bio-title" title={a.bioTitle}>
        <div className="flex max-w-[62ch] flex-col gap-6">
          {a.bio.map((p, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <p className={i === 0 ? 't-lede text-text' : 'text-lg text-muted'}>{p}</p>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* Focus areas */}
      <section aria-labelledby="interests-title" className="shell mt-20 md:mt-28">
        <h2 id="interests-title" className="t-md border-t border-line pt-8">{a.interestsTitle}</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {a.interests.map((it, i) => (
            <Reveal as="li" key={it.title} delay={0.06 * i} className="bg-bg p-6 md:p-8">
              <p className="t-md">{it.title}</p>
              <p className="mt-3 max-w-[34ch] text-muted">{it.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Experience: a dated timeline, so the rail and dates carry real order */}
      <Block id="exp-title" title={a.experienceTitle}>
        <ol className="relative border-l border-line-strong">
          {a.experience.map((e) => (
            <Reveal as="li" key={e.role} className="relative pb-10 pl-6 last:pb-0 md:pl-8">
              <span aria-hidden className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-[1.5px] border-accent bg-bg" />
              <p className="text-sm tabular-nums text-muted">{e.date}</p>
              <h3 className="t-md mt-1">{e.role}</h3>
              <p className="mt-1 text-[0.95rem] text-accent">{e.org}</p>
              <p className="mt-3 max-w-[60ch] text-muted">{e.body}</p>
              {e.items.length > 0 && (
                <ul className="mt-4 grid max-w-[62ch] gap-1.5">
                  {e.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.95rem]">
                      <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-line-strong" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      </Block>

      <Block id="edu-title" title={a.educationTitle}>
        <ul>
          {a.education.map((e) => (
            <Reveal as="li" key={e.school} className="grid gap-2 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-8 sm:gap-6">
              <p className="text-sm tabular-nums text-muted sm:col-span-3 sm:pt-1">{e.date}</p>
              <div className="sm:col-span-5">
                <h3 className="t-md">{e.school}</h3>
                <p className="mt-1 text-[0.95rem]">{e.program}</p>
                <p className="mt-2 text-muted">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Block>

      {/* Student-athlete: photo-led band */}
      <section aria-labelledby="athletic-title" className="mt-24 border-y border-line bg-surface md:mt-32">
        <div className="shell grid gap-10 py-16 md:grid-cols-12 md:gap-10 md:py-24">
          <Reveal className="md:col-span-5">
            <figure>
              <img
                src={trophy}
                alt={a.athleticPhotoAlt}
                width={740}
                height={1600}
                loading="lazy"
                className="mx-auto aspect-[3/4] w-full max-w-sm rounded-2xl object-cover md:max-w-none"
                style={{ objectPosition: '50% 22%' }}
              />
              <figcaption className="mt-3 text-sm text-muted">{a.athleticCaption}</figcaption>
            </figure>
          </Reveal>
          <div className="flex flex-col gap-10 md:col-span-6 md:col-start-7 md:justify-center">
            <Reveal>
              <h2 id="athletic-title" className="t-xl">{a.athleticTitle}</h2>
              <p className="t-lede mt-6 max-w-[44ch]">{a.athleticBody}</p>
            </Reveal>
            <Reveal>
              <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {a.athletes.map((s, i) => (
                  <li key={s.place} className="flex items-center gap-4 bg-surface px-4 py-3.5 sm:px-5">
                    {/* white chip keeps dark marks (MCC's black helmet) visible in both themes */}
                    <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-line">
                      <img src={teamLogos[i]} alt="" className="h-full w-full object-contain" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <span className="font-medium">{s.place}</span>
                      <span className="text-sm text-muted">{s.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal>
              <h3 className="text-sm text-muted">{a.recognitionTitle}</h3>
              <ul className="mt-3 grid gap-3">
                {a.recognitions.map((r) => (
                  <li key={r} className="flex gap-3">
                    <Award size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <Block id="sel-skills-title" title={a.skillsTitle}>
        <div>
          <ul className="flex flex-wrap gap-2">
            {selectedSkills.map((s) => <li key={s}><Tag className="px-3.5 py-2 text-sm text-text">{s}</Tag></li>)}
          </ul>
          <button
            type="button"
            onClick={() => goSection('skills')}
            className="group mt-8 inline-flex items-center gap-2 rounded-full py-1 font-medium"
          >
            {a.skillsLink}
            <ArrowRight size={17} className="text-accent transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </Block>
    </div>
  )
}
