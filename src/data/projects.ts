/**
 * Project registry: structure only. All visible copy lives in the
 * i18n dictionaries under `projects[slug]`.
 */
export type ProjectSlug =
  | 'customer-service-automation'
  | 'social-media-content'
  | 'daily-planner'
  | 'assignment-hub'
  | 'ai-video-clipping'

export type ProjectFilter = 'automation' | 'apps' | 'content'
export type PreviewKind = 'service' | 'content' | 'planner' | 'hub' | 'video'
export type DemoKind = 'nova' | 'hub'

export interface Project {
  slug: ProjectSlug
  filter: ProjectFilter
  preview: PreviewKind
  demo?: DemoKind
  /** Featured projects get the wide card on Home and Work. */
  featured?: boolean
}

export const projects: Project[] = [
  { slug: 'customer-service-automation', filter: 'automation', preview: 'service', demo: 'nova', featured: true },
  { slug: 'assignment-hub', filter: 'apps', preview: 'hub', demo: 'hub' },
  { slug: 'social-media-content', filter: 'content', preview: 'content' },
  { slug: 'daily-planner', filter: 'apps', preview: 'planner' },
  { slug: 'ai-video-clipping', filter: 'content', preview: 'video' },
]

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function nextProject(slug: ProjectSlug): Project {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
