import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import NoteCard from './NoteCard'
import { getStoredData } from '../utils/localStorage'

function RecentNotes() {
  const [notes, setNotes] = useState(() =>
    getStoredData('studyflow-notes', []),
  )

  useEffect(() => {
    function updateNotes() {
      setNotes(
        getStoredData('studyflow-notes', []),
      )
    }

    window.addEventListener(
      'studyflow-notes-updated',
      updateNotes,
    )

    return () => {
      window.removeEventListener(
        'studyflow-notes-updated',
        updateNotes,
      )
    }
  }, [])

  const recentNotes = [...notes]
    .slice(-3)
    .reverse()

  return (
    <div className="recent-notes">
      <div className="section-header">
        <div>
          <h2>Recent Notes</h2>
          <p>Your latest study notes</p>
        </div>

        <NavLink
          to="/notes"
          className="primary-button"
        >
          View All
        </NavLink>
      </div>

      <div className="notes-grid">
        {recentNotes.length === 0 ? (
          <p>No notes added yet.</p>
        ) : (
          recentNotes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.content}
              date={note.date || ''}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default RecentNotes
