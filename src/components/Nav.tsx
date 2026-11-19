import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, NavLink, useLocation } from 'react-router'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTheme } from '../theme/ThemeProvider'
import { useSectionNav } from '../lib/useSectionNav'
import { cx } from '../lib/utils'

export function Monogram() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-text" />
      <path d="M8 11h10M13 11v11" className="stroke-bg" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 16l7 7M25 16l-7 7" className="stroke-accent" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

const linkCls =
  'rounded-full px-3.5 py-2 text-[0.95rem] text-muted transition-colors hover:text-text aria-[current=page]:text-text'

export function Nav() {
  const { t, toggleLang } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const goSection = useSectionNav()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation (render-time reset) and on Escape.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const section = (id: string) => {
    setOpen(false)
    goSection(id)
  }

  const controls = (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleLang}
        aria-label={t.meta.switchLabel}
        className="h-10 min-w-10 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
      >
        {t.meta.switchToShort}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t.nav.themeToLight : t.nav.themeToDark}
        className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-text"
      >
        {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
      </button>
    </div>
  )

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        {t.nav.skip}
      </a>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300',
          scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <div className="shell flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link to="/" aria-label={t.nav.homeLabel} className="flex items-center gap-3 rounded-lg">
            <Monogram />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">Thales Xavier</span>
          </Link>

          <nav aria-label={t.nav.primary} className="hidden items-center gap-1 md:flex">
            <NavLink to="/projects" className={linkCls}>{t.nav.work}</NavLink>
            <NavLink to="/about" className={linkCls}>{t.nav.about}</NavLink>
            <button type="button" className={linkCls} onClick={() => section('skills')}>{t.nav.skills}</button>
            <button type="button" className={linkCls} onClick={() => section('contact')}>{t.nav.contact}</button>
            <span aria-hidden className="mx-2 h-5 w-px bg-line-strong" />
            {controls}
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            {controls}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-10 place-items-center rounded-full text-text hover:bg-surface-2"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.nav.primary}
            className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col bg-bg px-5 pb-10 pt-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col">
              {[
                { label: t.nav.home, to: '/' },
                { label: t.nav.work, to: '/projects' },
                { label: t.nav.about, to: '/about' },
              ].map((item, i) => (
                <motion.li key={item.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <NavLink to={item.to} end className="block border-b border-line py-4 font-display text-4xl font-medium tracking-tight aria-[current=page]:text-accent">
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              {[
                { label: t.nav.skills, id: 'skills' },
                { label: t.nav.contact, id: 'contact' },
              ].map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * (i + 3) }}>
                  <button type="button" onClick={() => section(item.id)} className="block w-full border-b border-line py-4 text-left font-display text-4xl font-medium tracking-tight">
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto text-sm text-muted">{t.hero.location}</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
