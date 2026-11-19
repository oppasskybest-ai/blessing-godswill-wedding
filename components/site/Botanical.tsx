/**
 * Original botanical line sprig used as a section ornament.
 * (Drawn for this project; the Canva illustration itself is not reused.)
 */
export default function Botanical({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 320 160"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* main stem */}
      <path d="M8 138 C70 128 120 110 170 84 C210 64 260 44 312 18" />
      {/* leaves */}
      <path d="M62 128 C54 108 66 94 84 90 C86 108 78 122 62 128Z" />
      <path d="M104 116 C116 98 134 96 146 102 C138 116 122 122 104 116Z" />
      <path d="M148 96 C150 74 166 62 184 62 C184 80 170 94 148 96Z" />
      <path d="M196 74 C206 56 224 50 240 54 C232 70 214 78 196 74Z" />
      <path d="M244 52 C250 36 266 28 282 30 C278 46 262 54 244 52Z" />
      {/* small flower */}
      <circle cx="290" cy="26" r="4" />
      <path d="M290 14 C294 20 294 22 290 22 C286 22 286 20 290 14Z" />
      <path d="M302 26 C296 30 294 30 294 26 C294 22 296 22 302 26Z" />
      <path d="M290 38 C286 32 286 30 290 30 C294 30 294 32 290 38Z" />
      <path d="M278 26 C284 22 286 22 286 26 C286 30 284 30 278 26Z" />
      {/* buds along the stem */}
      <circle cx="120" cy="108" r="2.4" />
      <circle cx="172" cy="84" r="2.4" />
      <circle cx="226" cy="62" r="2.4" />
    </svg>
  )
}
