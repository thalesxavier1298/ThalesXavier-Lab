import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Hero } from '../components/Hero'
import { ProjectCard } from '../components/ProjectCard'
import { ProcessSection, SkillsSection } from '../components/Sections'
import { ButtonLink, SectionHead } from '../components/ui'
import { projects } from '../data/projects'
import { useI18n } from '../i18n'
import { scrollToId } from '../lib/utils'

export function Home() {
  const { t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const [featured, ...rest] = projects

  // Arriving from another page with a section target (see useSectionNav).
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!target) return
    // Clearing the state re-runs this effect, so the scroll timer is not tied to its cleanup.
    navigate('.', { replace: true, state: null })
    window.setTimeout(() => scrollToId(target), 120)
  }, [location.state, navigate])

  return (
    <>
      <Hero />

      <section id="work" aria-labelledby="work-title" className="shell scroll-mt-20 py-20 md:py-28">
        <SectionHead
          id="work-title"
          title={t.home.workTitle}
          intro={t.home.workIntro}
          aside={
            <ButtonLink to="/projects" variant="ghost" className="self-start">
              {t.home.viewAll}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          }
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <ProjectCard project={featured} wide />
          </div>
          {rest.slice(0, 2).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <ProcessSection />
      <SkillsSection />
    </>
  )
}
