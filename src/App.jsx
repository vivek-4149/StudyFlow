import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Subjects from './pages/Subjects'
import Timer from './pages/Timer'
import Notes from './pages/Notes'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('studyflow-theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('studyflow-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
