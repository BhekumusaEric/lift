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
        const userId = url.searchParams.get('user_id')

        const { data, error } = await supabaseClient
          .from('reviews')
          .select(`
            *,
            reviewer:users!reviewer_id(*),
            reviewee:users!reviewee_id(*)
          `)
          .eq('reviewee_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify({ reviews: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'POST': {
        const body = await req.json()
        
        // Verify the ride is completed and user was part of it
        const { data: ride, error: rideError } = await supabaseClient
          .from('rides')
          .select('status, driver_id')
          .eq('id', body.ride_id)
          .single()

        if (rideError) throw rideError
        if (ride.status !== 'completed') {
          throw new Error('Can only review completed rides')
        }

        const { data, error } = await supabaseClient
          .from('reviews')
          .insert({
            ...body,
            reviewer_id: user.id,
          })
          .select()
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ review: data }),
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