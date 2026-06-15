import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (typeof window === 'undefined') {
      // For SSR, return no-op functions
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ 
            data: { subscription: { unsubscribe: () => {} } } 
          }),
        }
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ data: [], error: null }),
          insert: () => ({ data: [], error: null }),
          update: () => ({ data: [], error: null }),
          delete: () => ({ data: [], error: null }),
        })
      }
      return () => {}
    }

    if (!supabaseClient) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    }

    return (supabaseClient as any)[prop]
  }
})
