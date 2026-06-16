import { supabase } from './supabase'

// Returns the base URL to use for OAuth redirects.
// Priority: VITE_APP_URL env var → window.location.origin (fallback for local dev).
// On Vercel production, set VITE_APP_URL=https://yourdomain.com in env vars.
// Also whitelist your Vercel preview URLs in Supabase → Auth → URL Configuration.
function getAppUrl(): string {
  return import.meta.env.VITE_APP_URL?.replace(/\/$/, '') || window.location.origin
}

// Sign in with Google
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  })
  if (error) throw error
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
