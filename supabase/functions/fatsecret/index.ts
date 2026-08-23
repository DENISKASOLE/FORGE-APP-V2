// FORGE: FatSecret food-database proxy.
//
// Runs server-side (Deno, Supabase Edge Functions) so the FatSecret
// client secret never reaches the browser. The frontend calls this via
// supabase.functions.invoke('fatsecret', { body: { action, ... } }).
//
// Deploy: supabase functions deploy fatsecret
// Secrets (set these yourself -- never paste real credentials into chat):
//   supabase secrets set FATSECRET_CLIENT_ID=xxx FATSECRET_CLIENT_SECRET=xxx
//   supabase secrets set FATSECRET_SCOPE=basic   (optional, defaults to "basic";
//     use "premier" if your FatSecret plan has Premier access)

const FATSECRET_CLIENT_ID = Deno.env.get('FATSECRET_CLIENT_ID')
const FATSECRET_CLIENT_SECRET = Deno.env.get('FATSECRET_CLIENT_SECRET')
const FATSECRET_SCOPE = Deno.env.get('FATSECRET_SCOPE') || 'basic'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory token cache. Edge Function instances stay warm between
// requests for a while, so this meaningfully cuts down on token fetches
// even though it isn't guaranteed to persist across every cold start.
let cachedToken: string | null = null
let cachedTokenExpiry = 0

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (cachedToken && now < cachedTokenExpiry) return cachedToken

  if (!FATSECRET_CLIENT_ID || !FATSECRET_CLIENT_SECRET) {
    throw new Error('FatSecret credentials are not configured on the server.')
  }

  const basicAuth = btoa(`${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`)
  const res = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(FATSECRET_SCOPE)}`,
  })
  if (!res.ok) {
    throw new Error(`FatSecret auth failed (${res.status}): ${await res.text()}`)
  }
  const data = await res.json()
  cachedToken = data.access_token
  cachedTokenExpiry = now + (data.expires_in - 60) * 1000 // refresh 60s early
  return cachedToken as string
}

// FatSecret's JSON is XML-derived: a field is a bare object when there's
// exactly one, or an array when there's more than one. Normalize both to
// an array so callers don't have to special-case it.
function asArray<T>(x: T | T[] | undefined | null): T[] {
  if (!x) return []
  return Array.isArray(x) ? x : [x]
}

async function searchFoods(query: string) {
  const token = await getAccessToken()
  const url = new URL('https://platform.fatsecret.com/rest/foods/search/v1')
  url.searchParams.set('search_expression', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('max_results', '20')

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`FatSecret search failed (${res.status}): ${await res.text()}`)
  const data = await res.json()

  return asArray(data?.foods?.food).map((f: Record<string, string>) => ({
    id: f.food_id,
    name: f.food_name,
    brand: f.brand_name || null,
    description: f.food_description,
  }))
}

async function getFoodDetails(foodId: string) {
  const token = await getAccessToken()
  const url = new URL('https://platform.fatsecret.com/rest/food/v4')
  url.searchParams.set('food_id', foodId)
  url.searchParams.set('format', 'json')

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`FatSecret food.get failed (${res.status}): ${await res.text()}`)
  const data = await res.json()

  const servings = asArray(data?.food?.servings?.serving).map((s: Record<string, string>) => ({
    id: s.serving_id,
    description: s.serving_description,
    kcal: Math.round(Number(s.calories) || 0),
    protein: Math.round(Number(s.protein) || 0),
    carbs: Math.round(Number(s.carbohydrate) || 0),
    fat: Math.round(Number(s.fat) || 0),
    isDefault: s.is_default === '1',
  }))

  return {
    id: data?.food?.food_id,
    name: data?.food?.food_name,
    servings,
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, query, foodId } = await req.json()

    let result
    if (action === 'search') {
      if (!query || String(query).trim().length < 2) {
        result = []
      } else {
        result = await searchFoods(String(query).trim())
      }
    } else if (action === 'details') {
      if (!foodId) throw new Error('foodId is required')
      result = await getFoodDetails(String(foodId))
    } else {
      throw new Error(`Unknown action: ${action}`)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
