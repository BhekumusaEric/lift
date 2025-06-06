import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Ride = Database['public']['Tables']['rides']['Row'] & {
  driver: Database['public']['Tables']['users']['Row']
  vehicle?: Database['public']['Tables']['vehicles']['Row']
}

type RideRequest = Database['public']['Tables']['ride_requests']['Row'] & {
  ride: Ride
  passenger: Database['public']['Tables']['users']['Row']
}

interface RidesState {
  rides: Ride[]
  userRides: Ride[]
  rideRequests: RideRequest[]
  loading: boolean
  searchRides: (filters: {
    departure?: string
    destination?: string
    date?: string
    seats?: number
  }) => Promise<void>
  createRide: (rideData: Database['public']['Tables']['rides']['Insert']) => Promise<void>
  updateRide: (id: string, updates: Database['public']['Tables']['rides']['Update']) => Promise<void>
  deleteRide: (id: string) => Promise<void>
  requestRide: (rideId: string, seatsRequested: number) => Promise<void>
  updateRideRequest: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => Promise<void>
  fetchUserRides: () => Promise<void>
  fetchRideRequests: () => Promise<void>
}

export const useRidesStore = create<RidesState>((set, get) => ({
  rides: [],
  userRides: [],
  rideRequests: [],
  loading: false,

  searchRides: async (filters) => {
    set({ loading: true })
    try {
      let query = supabase
        .from('rides')
        .select(`
          *,
          driver:users!driver_id(*),
          vehicle:vehicles(*)
        `)
        .eq('status', 'scheduled')
        .gte('departure_time', new Date().toISOString())

      if (filters.departure) {
        query = query.ilike('departure_location', `%${filters.departure}%`)
      }
      if (filters.destination) {
        query = query.ilike('destination', `%${filters.destination}%`)
      }
      if (filters.date) {
        const startDate = new Date(filters.date)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)
        query = query.gte('departure_time', startDate.toISOString())
                    .lt('departure_time', endDate.toISOString())
      }
      if (filters.seats) {
        query = query.gte('available_seats', filters.seats)
      }

      const { data, error } = await query.order('departure_time', { ascending: true })

      if (error) throw error
      set({ rides: data || [] })
    } catch (error) {
      console.error('Error searching rides:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  createRide: async (rideData) => {
    const { data, error } = await supabase
      .from('rides')
      .insert(rideData)
      .select(`
        *,
        driver:users!driver_id(*),
        vehicle:vehicles(*)
      `)
      .single()

    if (error) throw error
    
    const { userRides } = get()
    set({ userRides: [data, ...userRides] })
  },

  updateRide: async (id, updates) => {
    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        driver:users!driver_id(*),
        vehicle:vehicles(*)
      `)
      .single()

    if (error) throw error
    
    const { userRides } = get()
    set({
      userRides: userRides.map(ride => ride.id === id ? data : ride)
    })
  },

  deleteRide: async (id) => {
    const { error } = await supabase
      .from('rides')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    const { userRides } = get()
    set({
      userRides: userRides.filter(ride => ride.id !== id)
    })
  },

  requestRide: async (rideId, seatsRequested) => {
    const { error } = await supabase
      .from('ride_requests')
      .insert({
        ride_id: rideId,
        seats_requested: seatsRequested,
      })

    if (error) throw error
  },

  updateRideRequest: async (id, status) => {
    const { error } = await supabase
      .from('ride_requests')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    
    await get().fetchRideRequests()
  },

  fetchUserRides: async () => {
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:users!driver_id(*),
        vehicle:vehicles(*)
      `)
      .order('departure_time', { ascending: false })

    if (error) throw error
    set({ userRides: data || [] })
  },

  fetchRideRequests: async () => {
    const { data, error } = await supabase
      .from('ride_requests')
      .select(`
        *,
        ride:rides(*,
          driver:users!driver_id(*),
          vehicle:vehicles(*)
        ),
        passenger:users!passenger_id(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    set({ rideRequests: data || [] })
  },
}))