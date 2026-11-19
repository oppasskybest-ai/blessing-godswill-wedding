export type Profile = {
  id: string
  username: string
  full_name: string
  phone: string
  gender: 'male' | 'female' | null
  address: string | null
  email: string | null
  is_admin: boolean
  created_at: string
}

export type PickupPoint = {
  id: string
  slug: string
  name: string
  address: string
  pickup_time: string
  capacity: number
  maps_url: string | null
  sort_order: number
  active: boolean
}

export type PickupContact = {
  pickup_id: string
  contact_name: string
  phone: string
}

export type BusStatus = 'pending' | 'approved' | 'declined'

export type BusRequest = {
  id: string
  user_id: string
  pickup_id: string
  status: BusStatus
  admin_note: string | null
  created_at: string
  decided_at: string | null
}

export type EventPhoto = {
  id: string
  path: string
  caption: string | null
  created_at: string
}
