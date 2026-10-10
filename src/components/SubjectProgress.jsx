import { useEffect, useState } from 'react'

import ProgressBar from './ProgressBar'

import { getStoredData } from '../utils/localStorage'

function SubjectProgress() {
  const [subjects, setSubjects] = useState(() =>
    getStoredData('studyflow-subjects', []),
  )

  const [tasks, setTasks] = useState(() =>
    getStoredData('studyflow-tasks', []),
  )

  useEffect(() => {
    function updateSubjects() {
      setSubjects(
        getStoredData('studyflow-subjects', []),
      )
    }

    function updateTasks() {
      setTasks(
        getStoredData('studyflow-tasks', []),
      )
    }

    window.addEventListener(
      'studyflow-subjects-updated',
      updateSubjects,
    )

    window.addEventListener(
      'studyflow-tasks-updated',
      updateTasks,
    )

    return () => {
      window.removeEventListener(
        'studyflow-subjects-updated',
        updateSubjects,
      )

      window.removeEventListener(
        'studyflow-tasks-updated',
        updateTasks,
      )
    }
  }, [])

  function getSubjectProgress(subjectName) {
    const subjectTasks = tasks.filter(
      (task) =>
        (task.subject || '').toLowerCase() ===
        subjectName.toLowerCase(),
    )

    if (subjectTasks.length === 0) {
      return 0
    }

    const completedTasks = subjectTasks.filter(
      (task) => task.completed,
    ).length

    return Math.round(
      (completedTasks / subjectTasks.length) * 100,
    )
  }

  function formatStudyHours(hours) {
    const numericHours = Number(hours || 0)

    if (numericHours === 0) {
      return '0h'
    }

    return `${numericHours.toFixed(1)}h`
  }

  return (
    <div className="subject-progress">
      <div className="section-header">
        <div>
          <h2>Subject Progress</h2>
          <p>Track your progress by subject</p>
        </div>
      </div>

      <div className="subject-list">
        {subjects.length === 0 ? (
          <p>No subjects added yet.</p>
        ) : (
          subjects.map((subject) => {
            const progress = getSubjectProgress(
              subject.name,
            )

            return (
              <div
                className="subject-row"
                key={subject.id}
              >
                <div className="subject-info">
                  <span>{subject.name}</span>

                  <span>
                    {progress}% ·{' '}
                    {formatStudyHours(
                      subject.studyHours,
                    )}{' '}
                    studied
                  </span>
                </div>

                <ProgressBar value={progress} />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SubjectProgress
