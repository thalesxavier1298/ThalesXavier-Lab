import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, ChevronLeft, ChevronRight, GalleryHorizontalEnd, Play, X } from 'lucide-react'
import { carousels, flyers, reels, thumbnails, type GalleryImage } from '../data/gallery'
import { useI18n } from '../i18n'
import { cx, fmt } from '../lib/utils'

/** Lightbox groups: flyers, thumbnails, and one group per carousel (its slides). */
type GroupKey = string
const groups: Record<GroupKey, GalleryImage[]> = {
  flyers,
  thumbnails,
  ...Object.fromEntries(carousels.map((c) => [c.id, c.slides])),
}

/** Accessible lightbox: focus moves in, Escape closes, arrows step, focus returns. */
function Lightbox({ group, index, onClose, onStep }: { group: GroupKey; index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const { t, lang } = useI18n()
  const g = t.gallery
  const items = groups[group]
  const item = items[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onStep])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[60] flex flex-col bg-bg/95 backdrop-blur-sm"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
        paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(12px, env(safe-area-inset-right, 0px))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between gap-4 px-2 py-2">
        <p className="min-w-0 truncate text-sm text-muted">
          <span className="tabular-nums">{fmt(g.counter, { i: index + 1, n: items.length })}</span>
          <span className="mx-2 text-faint">/</span>
          <span className="text-text">{item.title}</span>
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={g.close}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-text hover:border-text"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={item.id}
            src={item.src}
            alt={item.alt[lang]}
            width={item.width}
            height={item.height}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label={g.prev}
              className="absolute left-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/80 text-text ring-1 ring-line-strong hover:ring-text md:left-4"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label={g.next}
              className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-bg/80 text-text ring-1 ring-line-strong hover:ring-text md:right-4"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

function Thumb({ item, onOpen, className }: { item: GalleryImage; onOpen: () => void; className?: string }) {
  const { t, lang } = useI18n()
  return (
    <figure className={cx('group flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={fmt(t.gallery.open, { title: item.title })}
        className="overflow-hidden rounded-xl border border-line bg-surface"
      >
        <img
          src={item.src}
          alt={item.alt[lang]}
          width={item.width}
          height={item.height}
          loading="lazy"
          className="h-auto w-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025]"
        />
      </button>
      <figcaption className="text-sm leading-snug">{item.title}</figcaption>
    </figure>
  )
}

function GroupHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line pt-5">
      <h3 className="t-md">{title}</h3>
      <p className="text-sm text-muted">{note}</p>
    </div>
  )
}

export function ContentGallery() {
  const { t, lang } = useI18n()
  const g = t.gallery
  const [open, setOpen] = useState<{ group: GroupKey; index: number } | null>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)

  const show = (group: GroupKey, index: number) => {
    lastTrigger.current = document.activeElement as HTMLElement
    setOpen({ group, index })
  }
  const close = useCallback(() => {
    setOpen(null)
    window.setTimeout(() => lastTrigger.current?.focus({ preventScroll: true }), 0)
  }, [])
  const step = useCallback((d: 1 | -1) => {
    setOpen((o) => (o ? { ...o, index: (o.index + d + groups[o.group].length) % groups[o.group].length } : o))
  }, [])

  return (
    <div className="flex flex-col gap-14">
      <section aria-label={g.flyers}>
        <GroupHead title={g.flyers} note={g.flyersNote} />
        <div className="grid items-start gap-5 sm:grid-cols-3">
          {flyers.map((f, i) => (
            <Thumb key={f.id} item={f} onOpen={() => show('flyers', i)} />
          ))}
        </div>
      </section>

      <section aria-label={g.thumbnails}>
        <GroupHead title={g.thumbnails} note={g.thumbnailsNote} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {thumbnails.map((f, i) => (
            <Thumb key={f.id} item={f} onOpen={() => show('thumbnails', i)} />
          ))}
        </div>
      </section>

      <section aria-label={g.carousels}>
        <GroupHead title={g.carousels} note={g.carouselsNote} />
        <div className="grid max-w-2xl grid-cols-2 items-start gap-5">
          {carousels.map((c) => (
            <figure key={c.id} className="group flex flex-col gap-2">
              <button
                type="button"
                onClick={() => show(c.id, 0)}
                aria-label={fmt(g.openCarousel, { title: c.title, n: c.slides.length })}
                className="relative mr-3 mt-3"
              >
                {/* stacked edges hint that there is more than one slide */}
                <span aria-hidden className="absolute inset-0 translate-x-3 -translate-y-3 rounded-xl border border-line bg-surface-2" />
                <span aria-hidden className="absolute inset-0 translate-x-1.5 -translate-y-1.5 rounded-xl border border-line bg-surface" />
                <span className="relative block overflow-hidden rounded-xl border border-line bg-surface">
                  <img
                    src={c.slides[0].src}
                    alt={c.slides[0].alt[lang]}
                    width={c.slides[0].width}
                    height={c.slides[0].height}
                    loading="lazy"
                    className="h-auto w-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025]"
                  />
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    <GalleryHorizontalEnd size={13} />
                    {fmt(g.slides, { n: c.slides.length })}
                  </span>
                </span>
              </button>
              <figcaption className="text-sm leading-snug">{c.title}</figcaption>
            </figure>
          ))}
          {Array.from({ length: Math.max(0, 2 - carousels.length) }, (_, i) => (
            <div key={i} className="mr-3 mt-3 flex flex-col gap-2">
              <div className="hatch flex aspect-[4/5] items-end rounded-xl border border-dashed border-line-strong p-4">
                <span className="text-sm text-muted">{g.nextCarousel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={g.reels}>
        <GroupHead title={g.reels} note={g.reelsNote} />
        <ul className="grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
          {reels.map((r, i) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-80"
                  style={{ background: 'radial-gradient(120% 70% at 50% 110%, var(--accent-soft), transparent 70%)' }}
                />
                <span className="relative text-sm font-medium">{fmt(g.reel, { n: i + 1 })}</span>
                <span aria-hidden className="relative mx-auto grid size-14 place-items-center rounded-full bg-text text-bg transition-transform duration-300 group-hover:scale-105">
                  <Play size={22} className="translate-x-0.5" fill="currentColor" />
                </span>
                <span className="relative inline-flex items-center gap-1 text-sm text-muted group-hover:text-text">
                  {g.watch}
                  <ArrowUpRight size={15} className="text-accent" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {open && <Lightbox group={open.group} index={open.index} onClose={close} onStep={step} />}
      </AnimatePresence>
    </div>
  )
}
