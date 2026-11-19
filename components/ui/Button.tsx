import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'dark' | 'danger'

const VARIANTS: Record<Variant, string> = {
  // On green backgrounds
  solid: 'bg-cream text-forest hover:bg-cream-soft border border-cream',
  outline: 'bg-transparent text-cream border border-cream/60 hover:bg-cream/10',
  // On cream / aqua backgrounds
  dark: 'bg-forest text-cream hover:bg-forest-deep border border-forest',
  danger: 'bg-transparent text-burgundy border border-burgundy/50 hover:bg-burgundy/10',
}

const BASE =
  'label inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 min-h-11 transition-colors ' +
  'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center'

type LinkProps = { href: string; variant?: Variant; className?: string; children: ReactNode }
type ActionProps = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; variant?: Variant }

/** Renders a link when `href` is given (internal, external or tel:), otherwise a <button>. */
export default function Button(props: LinkProps | ActionProps) {
  if (props.href !== undefined) {
    const { href, variant = 'solid', className = '', children } = props
    const cls = `${BASE} ${VARIANTS[variant]} ${className}`
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      const newTab = href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}
      return (
        <a href={href} className={cls} {...newTab}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  const { variant = 'solid', className = '', type = 'button', children, ...rest } = props
  return (
    <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
