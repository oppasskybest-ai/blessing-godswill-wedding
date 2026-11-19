/**
 * Turns whatever the admin pastes into something a map preview can show.
 * Accepts a normal Google Maps link, a full "Embed a map" iframe snippet, or nothing
 * (then the address text is searched).
 */
export function extractUrl(input: string): string {
  const iframe = input.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)
  return (iframe ? iframe[1] : input).trim()
}

export function mapEmbedSrc(input: string, fallbackQuery: string): { src: string; exact: boolean } {
  const url = extractUrl(input)
  if (/^https:\/\/www\.google\.com\/maps\/embed/i.test(url)) return { src: url, exact: true }

  const coords =
    url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ||
    url.match(/[?&](?:q|query|ll|destination)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i)
  if (coords) return { src: `https://maps.google.com/maps?q=${coords[1]},${coords[2]}&z=16&output=embed`, exact: true }

  let q = ''
  try {
    const u = new URL(url)
    q = u.searchParams.get('q') || u.searchParams.get('query') || ''
  } catch {
    /* not a URL */
  }
  return { src: `https://maps.google.com/maps?q=${encodeURIComponent(q || fallbackQuery)}&z=15&output=embed`, exact: Boolean(q) }
}
