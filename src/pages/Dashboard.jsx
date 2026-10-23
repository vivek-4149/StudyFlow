
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import TaskList from '../components/TaskList'
import SubjectProgress from '../components/SubjectProgress'
import RecentNotes from '../components/RecentNotes'
import { getStoredData } from '../utils/localStorage'

function getGreeting() {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 21) return 'Good Evening'

  return 'Good Night'
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Dashboard({ userName = 'Student' }) {
  const [greeting, setGreeting] = useState(getGreeting)
  const [todayDate, setTodayDate] = useState(formatDate)

  const [tasks, setTasks] = useState(() =>
    getStoredData('studyflow-tasks', []),
  )

  const [sessions, setSessions] = useState(() =>
    getStoredData('studyflow-sessions', []),
  )

  // Update greeting and date
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting())
      setTodayDate(formatDate())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Keep task and study-session statistics updated
  useEffect(() => {
    function updateTasks() {
      setTasks(getStoredData('studyflow-tasks', []))
    }

    function updateSessions() {
      setSessions(getStoredData('studyflow-sessions', []))
    }

    window.addEventListener(
      'studyflow-tasks-updated',
      updateTasks,
    )

    window.addEventListener(
      'studyflow-sessions-updated',
      updateSessions,
    )

    return () => {
      window.removeEventListener(
        'studyflow-tasks-updated',
        updateTasks,
      )

      window.removeEventListener(
        'studyflow-sessions-updated',
        updateSessions,
      )
    }
  }, [])

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

  const pendingTasks = totalTasks - completedTasks

  const overallProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0

  const totalStudyMinutes = sessions.reduce(
    (total, session) => total + session.duration / 60,
    0,
  )

  const studyHours = Math.floor(totalStudyMinutes / 60)
  const studyMinutes = Math.round(totalStudyMinutes % 60)

  const studyTime =
    studyHours > 0
      ? `${studyHours}h ${studyMinutes}m`
      : `${studyMinutes}m`

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>
            {greeting}, {userName} 👋
          </h1>

          <p>Here's your study overview for today.</p>

          <p className="dashboard-date">
            {todayDate}
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          description="Tasks created"
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          description="Tasks completed"
        />

        <StatCard
          title="Pending"
          value={pendingTasks}
          description="Tasks remaining"
        />

        <StatCard
          title="Study Hours"
          value={studyTime}
          description="Total study time"
        />

        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          description="Your study progress"
        />
      </div>

      <TaskList />

      <SubjectProgress />

      <RecentNotes />
    </section>
  )
}

export default Dashboard
