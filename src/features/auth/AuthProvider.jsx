import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../data/profiles'
import { AuthContext } from '../../hooks/useAuth'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const userId = session?.user?.id
    let cancelled = false

    // Intentional: flips the loading flag before the fetch below starts,
    // so Gate can show a spinner instead of a stale/wrong-role screen.
    // eslint-disable-next-line react/set-state-in-effect
    setProfileLoading(Boolean(userId))
    Promise.resolve(userId ? getProfile(userId) : null).then((data) => {
      if (cancelled) return
      setProfile(data)
      setProfileLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [session?.user?.id])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    profile,
    profileLoading,
    role: profile?.role ?? null,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password, fullName, inviteCode) =>
      supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, invite_code: inviteCode || undefined } },
      }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
