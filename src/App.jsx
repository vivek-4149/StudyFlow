import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'

import Auth from './pages/Auth'
import ResetPassword from './pages/ResetPassword'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Subjects from './pages/Subjects'
import Timer from './pages/Timer'
import Notes from './pages/Notes'

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('studyflow-theme') || 'light',
  )
  const [session, setSession] = useState(null)
  const [userName, setUserName] = useState('Student')
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('studyflow-theme', theme)
  }, [theme])

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        console.error('Could not load session:', error.message)
      }

      setSession(data?.session ?? null)
      setUserName(
        data?.session?.user?.user_metadata?.full_name?.trim() ||
        data?.session?.user?.user_metadata?.name?.trim() ||
        data?.session?.user?.email?.split('@')[0] ||
        'Student'
      )
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUserName(
        newSession?.user?.user_metadata?.full_name?.trim() ||
        newSession?.user?.user_metadata?.name?.trim() ||
        newSession?.user?.email?.split('@')[0] ||
        'Student'
      )
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout failed:', error.message)
      alert('Logout nahi ho paya. Please dobara try karo.')
    }
  }

  if (authLoading) {
    return <main className="auth-page"><p>StudyFlow load ho raha hai...</p></main>
  }

  if (window.location.pathname === '/reset-password') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} userName={userName} onLogout={handleLogout} />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard userName={userName} />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
