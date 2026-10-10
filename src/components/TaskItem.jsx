function TaskItem({ task, onToggleComplete, onDelete, onEdit }) {
  return (
    <div className="task-row">
      <div>
        <h3 className={task.completed ? 'completed-task' : ''}>
          {task.title}
        </h3>

        <p>{task.subject}</p>

        <p className="task-due-date">
          Due: {task.dueDate || 'No date'}
        </p>
      </div>

      <div className="task-actions">
        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>

        <button onClick={() => onToggleComplete(task.id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        <button onClick={() => onEdit(task)}>
          Edit
        </button>

        <button onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskItem
