'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

/** Shows a recovery code once, with copy and "I have saved it" actions. */
export default function RecoveryCodeBox({ code, onDone, doneLabel = 'I have saved it, continue' }: { code: string; onDone: () => void; doneLabel?: string }) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false) // clipboard blocked: the code is still on screen to write down or screenshot
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-aqua/60 bg-aqua/10 p-6">
      <p className="label text-aqua">Your recovery code</p>
      <p className="heading select-all break-all text-center text-4xl tracking-widest text-cream sm:text-5xl" aria-live="polite">
        {code}
      </p>
      <p className="text-cream/85">
        If you ever forget your password, this code (with your username) lets you set a new one. <strong>It is shown only
        once.</strong> Screenshot it, write it down, or save it in your phone notes.
      </p>
      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input type="checkbox" className="size-5 accent-cream" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
        <span>I have saved my recovery code</span>
      </label>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={copy}>
          {copied ? 'Copied' : 'Copy code'}
        </Button>
        <Button disabled={!saved} onClick={onDone}>
          {doneLabel}
        </Button>
      </div>
    </div>
  )
}
