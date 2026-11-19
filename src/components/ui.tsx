import { motion } from 'motion/react'
import { Link } from 'react-router'
import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../lib/utils'

type Variant = 'primary' | 'ghost'

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[0.95rem] font-medium leading-none transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-text text-bg hover:bg-accent hover:text-accent-ink',
  ghost: 'border border-line-strong text-text hover:border-text',
}

export function ButtonLink({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(base, variants[variant], className)} {...props} />
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return <button type={type} className={cx(base, variants[variant], className)} {...props} />
}

export function Anchor({
  variant = 'primary',
  className,
  ...props
}: ComponentProps<'a'> & { variant?: Variant }) {
  return <a className={cx(base, variants[variant], className)} {...props} />
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border border-line px-2.5 py-1 text-[0.78rem] leading-none text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Small status chip used on previews: "Illustrative" or "Demo". */
export function Badge({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-bg/80 px-2.5 py-1 text-[0.72rem] font-medium text-muted ring-1 ring-line backdrop-blur-sm">
      <span
        aria-hidden
        className={cx('size-1.5 rounded-full', live ? 'bg-ok' : 'bg-faint')}
        style={live ? { animation: 'pulse-dot 1.8s ease-in-out infinite' } : undefined}
      />
      {children}
    </span>
  )
}

/**
 * Scroll-triggered reveal. Content is always present in the DOM and
 * fully readable without JS motion; reduced motion skips the offset.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'header' | 'li'
}) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

/** Section heading with an optional intro; left-aligned editorial layout. */
export function SectionHead({
  id,
  title,
  intro,
  aside,
}: {
  id?: string
  title: string
  intro?: string
  aside?: ReactNode
}) {
  return (
    <Reveal as="header" className="grid gap-6 border-t border-line pt-8 md:grid-cols-12 md:gap-10 md:pt-10">
      <h2 id={id} className="t-xl md:col-span-7">
        {title}
      </h2>
      <div className="flex flex-col justify-between gap-6 md:col-span-5 md:pt-2">
        {intro && <p className="t-lede max-w-[46ch]">{intro}</p>}
        {aside}
      </div>
    </Reveal>
  )
}
