import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    switch (req.method) {
      case 'GET': {
        const url = new URL(req.url)
        const rideId = url.searchParams.get('id')

        if (rideId) {
          // Get specific ride with driver and vehicle details
          const { data, error } = await supabaseClient
            .from('rides')
            .select(`
              *,
              driver:users!driver_id(*),
              vehicle:vehicles(*)
            `)
            .eq('id', rideId)
            .single()

          if (error) throw error

          return new Response(
            JSON.stringify({ ride: data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          // List rides with filters
          const status = url.searchParams.get('status')
          const departure = url.searchParams.get('departure')
          const destination = url.searchParams.get('destination')
          const date = url.searchParams.get('date')

          let query = supabaseClient
            .from('rides')
            .select(`
              *,
              driver:users!driver_id(*),
              vehicle:vehicles(*)
            `)

          if (status) query = query.eq('status', status)
          if (departure) query = query.ilike('departure_location', `%${departure}%`)
          if (destination) query = query.ilike('destination', `%${destination}%`)
          if (date) query = query.gte('departure_time', date).lt('departure_time', `${date}T23:59:59`)

          const { data, error } = await query

          if (error) throw error

          return new Response(
            JSON.stringify({ rides: data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'POST': {
        const body = await req.json()
        const { data, error } = await supabaseClient
          .from('rides')
          .insert({
            ...body,
            driver_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ ride: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        const body = await req.json()
        const { id, ...updates } = body

        const { data, error } = await supabaseClient
          .from('rides')
          .update(updates)
          .eq('id', id)
          .eq('driver_id', user.id) // Ensure user owns the ride
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ ride: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})