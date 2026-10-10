import { useState } from 'react'

function NoteForm({ onAddNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      return
    }

    onAddNote({
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
    })

    setTitle('')
    setContent('')
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows="5"
      />

      <button
        type="submit"
        className="primary-button"
      >
        + Add Note
      </button>
    </form>
  )
}

export default NoteForm
