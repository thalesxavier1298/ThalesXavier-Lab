import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getProject, nextProject } from '../data/projects'
import { useI18n } from '../i18n'
import { ProjectPreview } from '../components/previews/Previews'
import { Badge, ButtonLink, Reveal, Tag } from '../components/ui'
import { NovaDriveDemo } from '../demos/NovaDriveDemo'
import { AssignmentHubDemo } from '../demos/AssignmentHubDemo'
import { ContentGallery } from '../components/ContentGallery'

/** Label-left, content-right editorial row. */
function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
      <h2 className="t-md md:col-span-4">{title}</h2>
      <div className="md:col-span-8">{children}</div>
    </Reveal>
  )
}

export function CaseStudy() {
  const { slug } = useParams()
  const { t } = useI18n()
  const project = getProject(slug)

  if (!project) {
    return (
      <div className="shell flex min-h-[70vh] flex-col items-start justify-center gap-6 pt-28">
        <h1 className="t-xl">{t.caseStudy.notFoundTitle}</h1>
        <p className="t-lede">{t.caseStudy.notFoundBody}</p>
        <ButtonLink to="/projects">{t.caseStudy.back}</ButtonLink>
      </div>
    )
  }

  const c = t.projects[project.slug]
  const next = nextProject(project.slug)
  const isGallery = project.preview === 'content'

  return (
    <article className="pb-10 pt-28 md:pt-36">
      <div className="shell">
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-full py-1 text-sm text-muted transition-colors hover:text-text">
          <ArrowLeft size={16} />
          {t.caseStudy.back}
        </Link>

        <header className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-muted">{c.kind}</p>
            <h1 className="t-xl mt-3">{c.title}</h1>
          </div>
          <p className="t-lede max-w-[42ch] self-end md:col-span-4">{c.summary}</p>
        </header>

        <dl className="mt-12 grid gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t.caseStudy.role, value: c.kind },
            { label: t.caseStudy.org, value: c.org },
            { label: t.caseStudy.date, value: c.date },
            { label: t.caseStudy.status, value: c.status },
          ]
            .filter((m) => m.value)
            .map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-muted">{m.label}</dt>
                <dd className="mt-1">{m.value}</dd>
              </div>
            ))}
          <div className="sm:col-span-2 lg:col-span-4">
            <dt className="text-sm text-muted">{t.caseStudy.tools}</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {c.tools.map((tool) => <li key={tool}><Tag>{tool}</Tag></li>)}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      {/* Visual stage: the interactive demo when there is one, otherwise the preview */}
      <section aria-labelledby="stage-title" className="shell mt-14 md:mt-20">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="stage-title" className="t-md">{project.demo ? t.caseStudy.demo : isGallery ? t.gallery.title : t.caseStudy.preview}</h2>
          <p className="max-w-[60ch] text-sm text-muted">{project.demo ? t.caseStudy.demoIntro : isGallery ? t.gallery.intro : c.previewCaption}</p>
        </div>
        {isGallery ? (
          <ContentGallery />
        ) : (
        <div className="dotgrid relative rounded-3xl border border-line bg-surface/40 p-3 sm:p-6 md:p-10">
          {project.demo === 'nova' && <NovaDriveDemo />}
          {project.demo === 'hub' && <AssignmentHubDemo />}
          {!project.demo && (
            <>
              <div className="mb-4"><Badge>{t.previews.illustrative}</Badge></div>
              <div className="mx-auto h-[22rem] max-w-5xl sm:h-[26rem] md:h-[34rem]">
                <ProjectPreview kind={project.preview} large />
              </div>
            </>
          )}
        </div>
        )}
        {project.demo && <p className="mt-3 text-sm text-muted">{c.previewCaption}</p>}
      </section>

      <div className="shell mt-16 md:mt-24">
        <Row title={t.caseStudy.overview}>
          <p className="t-lede max-w-[60ch] text-text">{c.overview}</p>
        </Row>
        <Row title={t.caseStudy.problem}>
          <p className="max-w-[60ch] text-lg text-muted">{c.problem}</p>
        </Row>
        <Row title={t.caseStudy.approach}>
          <p className="max-w-[60ch] text-lg">{c.approach}</p>
        </Row>
        <Row title={t.caseStudy.features}>
          <ul className="flex max-w-[62ch] flex-col">
            {c.features.map((f) => (
              <li key={f} className="flex gap-4 border-b border-line py-3.5 first:pt-0 last:border-0">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-lg">{f}</span>
              </li>
            ))}
          </ul>
        </Row>
        <Row title={t.caseStudy.result}>
          <p className="max-w-[60ch] text-lg text-muted">{c.result}</p>
        </Row>
        <Row title={t.caseStudy.contribution}>
          <p className="max-w-[60ch] text-lg">{c.contribution}</p>
        </Row>

        <Link
          to={`/projects/${next.slug}`}
          className="group mt-6 flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-line-strong md:flex-row md:items-end md:justify-between md:p-10"
        >
          <span>
            <span className="block text-sm text-muted">{t.caseStudy.next}</span>
            <span className="t-lg mt-2 block">{t.projects[next.slug].title}</span>
          </span>
          <ArrowUpRight size={36} strokeWidth={1.5} className="text-accent transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
