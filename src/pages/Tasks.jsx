import { useEffect, useState } from 'react'

import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import { getStoredData, saveData } from '../utils/localStorage'

function Tasks() {
  const subjects = getStoredData('studyflow-subjects', [])

  const [tasks, setTasks] = useState(() =>
  getStoredData('studyflow-tasks', []),
)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [filterPriority, setFilterPriority] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  useEffect(() => {
  saveData('studyflow-tasks', tasks)
}, [tasks])
  function handleAddTask(newTask) {
    setTasks((previousTasks) => [...previousTasks, newTask])
  }

  function handleToggleComplete(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  function handleDelete(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    )
  }

  function handleEdit(task) {
    setEditingTask({ ...task })
  }

  function handleSaveEdit() {
    if (!editingTask.title.trim() || !editingTask.subject.trim()) {
      return
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === editingTask.id ? editingTask : task,
      ),
    )

    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority =
      filterPriority === 'All' || task.priority === filterPriority

    return matchesSearch && matchesPriority
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      }

      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }

    if (sortBy === 'dueDate') {
      const dateA = a.dueDate || '9999-12-31'
      const dateB = b.dueDate || '9999-12-31'

      return new Date(dateA) - new Date(dateB)
    }

    return 0
  })

  return (
    <section className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Task Manager</h1>
          <p>Manage your study tasks and stay organized.</p>
        </div>
      </div>

      <div className="task-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="priority-filter">
        <label htmlFor="priority-filter">Priority:</label>

        <select
          id="priority-filter"
          value={filterPriority}
          onChange={(event) => setFilterPriority(event.target.value)}
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="task-sort">
        <label htmlFor="task-sort">Sort:</label>

        <select
          id="task-sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="default">Default</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <TaskForm onAddTask={handleAddTask} />

      <div className="task-stats">
        <div>
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div>
          <span>Completed</span>
          <strong> 
            {tasks.filter((task) => task.completed).length}
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {tasks.filter((task) => !task.completed).length}
          </strong>
        </div>
      </div>

      {editingTask && (
        <div className="edit-task">
          <h2>Edit Task</h2>

          <input
            type="text"
            value={editingTask.title}
            onChange={(event) =>
              setEditingTask({
                ...editingTask,
                title: event.target.value,
              })
            }
          />

          <select
            value={editingTask.subject}
            onChange={(event) =>
              setEditingTask({
                ...editingTask,
                subject: event.target.value,
              })
            }
          >

            <option value="">Select Subject</option>

            {subjects.map((subject) => (
              <option
                key={subject.id}
                value={subject.name}
              >
                {subject.name}
              </option>
            ))}
          </select>

          <select
            value={editingTask.priority}
            onChange={(event) =>
              setEditingTask({
                ...editingTask,
                priority: event.target.value,
              })
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            className="primary-button"
            onClick={handleSaveEdit}
          >
            Save Changes
          </button>

          <button
            className="secondary-button"
            onClick={() => setEditingTask(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <p>
            {searchTerm
              ? 'No matching tasks found.'
              : 'No tasks yet. Add your first task above.'}
          </p>
        ) : (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default Tasks
