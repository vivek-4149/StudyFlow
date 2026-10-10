import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>StudyFlow</h2>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/subjects">Subjects</NavLink>
        <NavLink to="/timer">Study Timer</NavLink>
        <NavLink to="/notes">Notes</NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
