/** Public URL of a file in the event-photos storage bucket. */
export function photoUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/event-photos/${path}`
}
