/** Shown on guest pages until the Supabase keys are added to .env.local. */
export default function NotConfigured() {
  return (
    <div className="rounded-2xl border border-aqua/50 bg-aqua/10 p-6 text-aqua">
      <p className="label">Almost ready</p>
      <p className="mt-2 text-cream/85">
        Registration and login switch on once the database is connected. (Developer note: add the Supabase keys to
        <code className="mx-1 rounded bg-forest-deep px-1">.env.local</code> and run supabase/schema.sql.)
      </p>
    </div>
  )
}
