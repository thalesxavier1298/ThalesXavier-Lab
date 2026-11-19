import type { PointerEvent } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { useI18n } from '../i18n'
import { cx } from '../lib/utils'
import { ProjectPreview } from './previews/Previews'
import { Badge, Tag } from './ui'

/** Pointer-follow spotlight; CSS hides it on touch devices. */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  const { t } = useI18n()
  const copy = t.projects[project.slug]

  return (
    <article
      onPointerMove={trackPointer}
      className={cx(
        'spotlight group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-line-strong',
        wide && 'md:grid md:grid-cols-12',
      )}
    >
      <div
        className={cx(
          'dotgrid relative overflow-hidden border-b border-line p-4 sm:p-6',
          wide ? 'aspect-[4/3] sm:aspect-[16/10] md:col-span-8 md:aspect-auto md:min-h-[30rem] md:border-b-0 md:border-r md:p-10' : 'aspect-[4/3] sm:aspect-[16/11]',
        )}
      >
        <div className="absolute left-4 top-4 z-10 flex gap-2 sm:left-5 sm:top-5">
          <Badge live={!!project.demo}>{project.demo ? t.previews.demo : project.preview === 'content' ? t.previews.real : t.previews.illustrative}</Badge>
        </div>
        <div
          aria-hidden
          inert
          className="h-full pt-8 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1 group-hover:scale-[1.012]"
        >
          <ProjectPreview kind={project.preview} />
        </div>
      </div>

      <div className={cx('flex flex-1 flex-col gap-4 p-5 sm:p-6', wide && 'md:col-span-4 md:p-8')}>
        <p className="text-sm text-muted">{copy.kind}</p>
        <h3 className={wide ? 't-lg' : 't-md'}>
          <Link to={`/projects/${project.slug}`} className="rounded-sm after:absolute after:inset-0 after:content-['']">
            {copy.title}
          </Link>
        </h3>
        <p className="max-w-[48ch] text-muted">{copy.summary}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {copy.tags.map((tag) => (
            <li key={tag}><Tag>{tag}</Tag></li>
          ))}
        </ul>
        <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.95rem] font-medium">
          {t.work.openCase}
          <ArrowUpRight size={17} className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}
