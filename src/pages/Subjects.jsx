import { useEffect, useState } from 'react'

import {
  getStoredData,
  saveData,
} from '../utils/localStorage'

function Subjects() {
  const [subjects, setSubjects] = useState(() =>
    getStoredData('studyflow-subjects', []),
  )

  const [tasks, setTasks] = useState(() =>
    getStoredData('studyflow-tasks', []),
  )

  const [name, setName] = useState('')
  const [editingSubject, setEditingSubject] = useState(null)

  useEffect(() => {
    saveData('studyflow-subjects', subjects)
  }, [subjects])

  useEffect(() => {
    function updateTasks() {
      setTasks(
        getStoredData('studyflow-tasks', []),
      )
    }

    window.addEventListener(
      'studyflow-tasks-updated',
      updateTasks,
    )

    return () => {
      window.removeEventListener(
        'studyflow-tasks-updated',
        updateTasks,
      )
    }
  }, [])

  function getSubjectProgress(subjectName) {
    const subjectTasks = tasks.filter(
      (task) => task.subject.toLowerCase() === subjectName.toLowerCase(),
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

  function handleAddSubject(event) {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    const newSubject = {
      id: Date.now(),
      name: name.trim(),
      progress: 0,
      studyHours: 0,
    }

    setSubjects((previousSubjects) => [
      ...previousSubjects,
      newSubject,
    ])

    setName('')
  }

  function handleStudyHoursChange(subjectId, newHours) {
    setSubjects((previousSubjects) =>
      previousSubjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              studyHours: Number(newHours),
            }
          : subject,
      ),
    )
  }

  function handleEditSubject(subject) {
    setEditingSubject({ ...subject })
  }

  function handleSaveEdit() {
    if (!editingSubject.name.trim()) {
      return
    }

    setSubjects((previousSubjects) =>
      previousSubjects.map((subject) =>
        subject.id === editingSubject.id
          ? editingSubject
          : subject,
      ),
    )

    setEditingSubject(null)
  }

  function handleDeleteSubject(subjectId) {
    setSubjects((previousSubjects) =>
      previousSubjects.filter(
        (subject) => subject.id !== subjectId,
      ),
    )
  }

  return (
    <section className="subjects-page">
      <div className="page-header">
        <div>
          <h1>Subjects</h1>
          <p>Track your study progress by subject.</p>
        </div>
      </div>

      <form
        className="subject-form"
        onSubmit={handleAddSubject}
      >
        <input
          type="text"
          placeholder="Enter subject name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <button
          type="submit"
          className="primary-button"
        >
          + Add Subject
        </button>
      </form>

      {editingSubject && (
        <div className="edit-task">
          <h2>Edit Subject</h2>

          <input
            type="text"
            value={editingSubject.name}
            onChange={(event) =>
              setEditingSubject({
                ...editingSubject,
                name: event.target.value,
              })
            }
          />

          <button
            className="primary-button"
            onClick={handleSaveEdit}
          >
            Save Changes
          </button>

          <button
            className="secondary-button"
            onClick={() => setEditingSubject(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="subjects-grid">
        {subjects.length === 0 ? (
          <p>
            No subjects yet. Add your first subject above.
          </p>
        ) : (
          subjects.map((subject) => (
            <div
              className="subject-card"
              key={subject.id}
            >
              <h2>{subject.name}</h2>

              <p>Progress: {getSubjectProgress(subject.name)}%</p>

              <input
                type="range"
                min="0"
                max="100"
                value={getSubjectProgress(subject.name)}
              />

              <label>
                Study Hours

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={subject.studyHours}
                  onChange={(event) =>
                    handleStudyHoursChange(
                      subject.id,
                      event.target.value,
                    )
                  }
                />
              </label>

              <button
                className="primary-button"
                onClick={() =>
                  handleEditSubject(subject)
                }
              >
                Edit
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  handleDeleteSubject(subject.id)
                }
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Subjects
