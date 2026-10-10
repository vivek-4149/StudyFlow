import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { getStoredData } from '../utils/localStorage'

function TaskList() {
  const [tasks, setTasks] = useState(() =>
    getStoredData('studyflow-tasks', []),
  )

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

  const today = new Date()
    .toISOString()
    .split('T')[0]

  const todayTasks = tasks.filter(
    (task) => task.dueDate === today,
  )

  return (
    <div className="task-list">
      <div className="section-header">
        <div>
          <h2>Today's Tasks</h2>
          <p>Your tasks for today</p>
        </div>

        <NavLink
          to="/tasks"
          className="primary-button"
        >
          View All
        </NavLink>
      </div>

      <div className="tasks">
        {todayTasks.length === 0 ? (
          <p>No tasks due today.</p>
        ) : (
          todayTasks.map((task) => (
            <div
              className={`task-row ${
                task.completed ? 'completed' : ''
              }`}
              key={task.id}
            >
              <div>
                <h3>{task.title}</h3>
                <p>{task.subject}</p>
              </div>

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskList
