import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const INPUT =
  'w-full rounded-xl border border-cream/30 bg-forest-deep/60 px-4 py-3 text-base text-cream ' +
  'placeholder:text-cream/40 focus:border-cream focus:outline-none'

function Wrap({ label, hint, required, optional, children }: { label: string; hint?: string; required?: boolean; optional?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label mb-2 flex items-baseline gap-2 text-cream/80">
        {label}
        {required && <span aria-hidden className="text-aqua">*</span>}
        {optional && <span className="normal-case tracking-normal text-cream/50 text-xs">(optional)</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-sm text-cream/60">{hint}</span>}
    </label>
  )
}

type Common = { label: string; hint?: string; optional?: boolean }

export function TextField({ label, hint, optional, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap label={label} hint={hint} required={props.required} optional={optional}>
      <input {...props} className={INPUT} />
    </Wrap>
  )
}

export function TextAreaField({ label, hint, optional, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap label={label} hint={hint} required={props.required} optional={optional}>
      <textarea rows={3} {...props} className={INPUT} />
    </Wrap>
  )
}

export function SelectField({ label, hint, optional, children, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrap label={label} hint={hint} required={props.required} optional={optional}>
      <select {...props} className={INPUT}>
        {children}
      </select>
    </Wrap>
  )
}
