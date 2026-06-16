import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

function getClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'Check your .env.local and Vercel Environment Variables.'
    )
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// SSR no-op stub — returned on the server where window is unavailable.
// NOTE: this means server-side loaders will always get empty data.
// To fix properly, use @supabase/ssr createServerClient in your server fns.
const ssrStub = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithOAuth: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
  }),
} as unknown as ReturnType<typeof createClient>

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    if (typeof window === 'undefined') {
      return (ssrStub as any)[prop]
    }
    return (getClient() as any)[prop]
  },
})
