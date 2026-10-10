import { useEffect, useState } from 'react'

import {
  getStoredData,
  saveData,
} from '../utils/localStorage'

const SESSION_DURATION = 45 * 60

function Timer() {
  const [seconds, setSeconds] = useState(SESSION_DURATION)
  const [isRunning, setIsRunning] = useState(false)

  const [subjects, setSubjects] = useState(() =>
    getStoredData('studyflow-subjects', []),
  )

  const [selectedSubjectId, setSelectedSubjectId] =
    useState('')

  useEffect(() => {
    function updateSubjects() {
      setSubjects(
        getStoredData('studyflow-subjects', []),
      )
    }

    window.addEventListener(
      'studyflow-subjects-updated',
      updateSubjects,
    )

    return () => {
      window.removeEventListener(
        'studyflow-subjects-updated',
        updateSubjects,
      )
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRunning(false)

          const sessions = getStoredData(
            'studyflow-sessions',
            [],
          )

          const newSession = {
            id: Date.now(),
            duration: SESSION_DURATION,
            subjectId: selectedSubjectId || null,
            completedAt: new Date().toISOString(),
          }

          saveData('studyflow-sessions', [
            ...sessions,
            newSession,
          ])

          window.dispatchEvent(
            new Event('studyflow-sessions-updated'),
          )

          if (selectedSubjectId) {
            const currentSubjects = getStoredData(
              'studyflow-subjects',
              [],
            )

            const updatedSubjects =
              currentSubjects.map((subject) =>
                subject.id === Number(selectedSubjectId)
                  ? {
                      ...subject,
                      studyHours:
                        Number(subject.studyHours || 0) +
                        SESSION_DURATION / 3600,
                    }
                  : subject,
              )

            saveData(
              'studyflow-subjects',
              updatedSubjects,
            )
          }

          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, selectedSubjectId])

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`

  function handleReset() {
    setIsRunning(false)
    setSeconds(SESSION_DURATION)
  }

  return (
    <section className="timer-page">
      <div className="page-header">
        <div>
          <h1>Study Timer</h1>
          <p>
            Focus on your study session and track your time.
          </p>
        </div>
      </div>

      <div className="timer-card">
        <p className="timer-mode">Focus Session</p>

        <label>
          Study Subject
          <select
            value={selectedSubjectId}
            onChange={(event) =>
              setSelectedSubjectId(event.target.value)
            }
            disabled={isRunning}
          >
            <option value="">
              General Study
            </option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        <h2>{formattedTime}</h2>

        <div className="timer-actions">
          <button
            className="primary-button"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            className="secondary-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}

export default Timer
