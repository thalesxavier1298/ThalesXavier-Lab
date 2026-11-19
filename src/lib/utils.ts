/** Replace {key} tokens in a template string. */
export function fmt(template: string, params: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`,
  )
}

/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** localStorage access that never throws (private mode, blocked storage, previews). */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* storage unavailable: preference simply isn't remembered */
    }
  },
}

/** Scroll to an element id, respecting reduced-motion preferences. */
export function scrollToId(id: string): void {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  // Move focus for keyboard and screen-reader users without a second scroll.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export const EMAIL = 'thalesxavier1298@gmail.com'
export const PHONES = {
  us: { display: '+1 (585) 360-6732', href: 'tel:+15853606732' },
  br: { display: '+55 (24) 99983-0145', href: 'tel:+5524999830145' },
}
export const GITHUB_URL = 'https://github.com/thalesxavier1298'
/** Teófilo browser game, served from public/jarvis/ on the same site. */
export const GAME_URL =
  import.meta.env.VITE_ROUTER === 'memory' ? 'https://thalesxavierwork.com/jarvis/' : '/jarvis/'
