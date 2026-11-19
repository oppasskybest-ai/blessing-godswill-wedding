'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PageShell from '@/components/site/PageShell'
import BusTab from '@/components/admin/BusTab'
import GuestsTab from '@/components/admin/GuestsTab'
import PhotosTab from '@/components/admin/PhotosTab'
import PickupsTab from '@/components/admin/PickupsTab'
import { useAuth } from '@/lib/auth/AuthProvider'

const TABS = [
  { id: 'bus', label: 'Bus requests' },
  { id: 'guests', label: 'Guests' },
  { id: 'pickups', label: 'Pickups' },
  { id: 'photos', label: 'Photos' },
] as const
type TabId = (typeof TABS)[number]['id']

/**
 * The real protection is row-level security in the database (supabase/schema.sql):
 * a non-admin who opens this page simply gets no data. This check only gives a clean redirect.
 */
export default function AdminPage() {
  const router = useRouter()
  const { session, isAdmin, loading, profile } = useAuth()
  const [tab, setTab] = useState<TabId>('bus')

  useEffect(() => {
    if (loading) return
    if (!session) router.replace('/login?next=/admin')
    else if (profile && !isAdmin) router.replace('/account')
  }, [loading, session, profile, isAdmin, router])

  if (loading || !isAdmin) {
    return (
      <PageShell title="Admin">
        <p className="text-cream/70">Checking access…</p>
      </PageShell>
    )
  }

  return (
    <PageShell title="Admin" intro="Manage guests, approve bus seats, edit takeoff points and upload event photos." wide>
      <div role="tablist" aria-label="Admin sections" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`label min-h-11 cursor-pointer rounded-full border px-5 ${
              tab === t.id ? 'border-cream bg-cream text-forest' : 'border-cream/40 text-cream hover:bg-cream/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'bus' && <BusTab />}
      {tab === 'guests' && <GuestsTab />}
      {tab === 'pickups' && <PickupsTab />}
      {tab === 'photos' && <PhotosTab />}
    </PageShell>
  )
}
