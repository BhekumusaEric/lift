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
      case 'POST': {
        const body = await req.json()
        
        // Check if ride exists and has available seats
        const { data: ride, error: rideError } = await supabaseClient
          .from('rides')
          .select('available_seats, driver_id')
          .eq('id', body.ride_id)
          .single()

        if (rideError) throw rideError
        if (ride.driver_id === user.id) throw new Error('Cannot request your own ride')
        if (ride.available_seats < body.seats_requested) {
          throw new Error('Not enough available seats')
        }

        // Create ride request
        const { data, error } = await supabaseClient
          .from('ride_requests')
          .insert({
            ...body,
            passenger_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ request: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'PUT': {
        const body = await req.json()
        const { id, status } = body

        // Verify user is either the passenger or the ride's driver
        const { data: request, error: requestError } = await supabaseClient
          .from('ride_requests')
          .select('passenger_id, ride_id')
          .eq('id', id)
          .single()

        if (requestError) throw requestError

        const { data: ride, error: rideError } = await supabaseClient
          .from('rides')
          .select('driver_id')
          .eq('id', request.ride_id)
          .single()

        if (rideError) throw rideError

        if (user.id !== request.passenger_id && user.id !== ride.driver_id) {
          throw new Error('Unauthorized to update this request')
        }

        const { data, error } = await supabaseClient
          .from('ride_requests')
          .update({ status })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ request: data }),
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