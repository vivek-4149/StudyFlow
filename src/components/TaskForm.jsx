import { useState } from 'react'
import { getStoredData } from '../utils/localStorage'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')

  const subjects = getStoredData(
    'studyflow-subjects',
    [],
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !subject || !dueDate) {
      return
    }

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      subject,
      priority,
      dueDate,
      completed: false,
    })

    setTitle('')
    setSubject('')
    setPriority('Medium')
    setDueDate('')
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
      />

      <select
        value={subject}
        onChange={(event) =>
          setSubject(event.target.value)
        }
      >
        <option value="">
          Select Subject
        </option>

        {subjects.map((item) => (
          <option
            key={item.id}
            value={item.name}
          >
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value)
        }
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(event) =>
          setDueDate(event.target.value)
        }
      />

      <button
        type="submit"
        className="primary-button"
      >
        Add Task
      </button>
    </form>
  )
}

export default TaskForm
