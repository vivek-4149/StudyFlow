import { useEffect, useState } from 'react'

import NoteForm from '../components/NoteForm'
import NoteCard from '../components/NoteCard'

import {
  getStoredData,
  saveData,
} from '../utils/localStorage'

function Notes() {
  const [notes, setNotes] = useState(() =>
    getStoredData('studyflow-notes', []),
  )

  const [search, setSearch] = useState('')
  const [editingNote, setEditingNote] = useState(null)

  useEffect(() => {
    saveData('studyflow-notes', notes)
  }, [notes])

  function handleAddNote(newNote) {
    setNotes((previousNotes) => [
      ...previousNotes,
      newNote,
    ])
  }

  function handleEditNote(note) {
    setEditingNote({ ...note })
  }

  function handleSaveEdit() {
    if (
      !editingNote ||
      !editingNote.title.trim() ||
      !editingNote.content.trim()
    ) {
      return
    }

    setNotes((previousNotes) =>
      previousNotes.map((note) =>
        note.id === editingNote.id
          ? editingNote
          : note,
      ),
    )

    setEditingNote(null)
  }

  function handleDeleteNote(noteId) {
    setNotes((previousNotes) =>
      previousNotes.filter(
        (note) => note.id !== noteId,
      ),
    )
  }

  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase()

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    )
  })

  return (
    <section className="notes-page">
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>Create and manage your study notes.</p>
        </div>
      </div>

      <NoteForm onAddNote={handleAddNote} />

      <input
        className="search-input"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {editingNote && (
        <div className="edit-task">
          <h2>Edit Note</h2>

          <input
            type="text"
            value={editingNote.title}
            onChange={(event) =>
              setEditingNote({
                ...editingNote,
                title: event.target.value,
              })
            }
          />

          <textarea
            rows="5"
            value={editingNote.content}
            onChange={(event) =>
              setEditingNote({
                ...editingNote,
                content: event.target.value,
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
            onClick={() => setEditingNote(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <p>No matching notes found.</p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.content}
              date={note.date || ''}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default Notes
