function NoteCard({
  title,
  content,
  date,
  onEdit,
  onDelete,
}) {
  return (
    <div className="note-card">
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        <span>{date}</span>
      </div>

      <div className="note-actions">
        <button
          className="primary-button"
          onClick={onEdit}
        >
          Edit
        </button>

        <button
          className="secondary-button"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default NoteCard
