function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        StudyFlow
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        <div className="navbar-user">
          Student
        </div>
      </div>
    </nav>
  )
}

export default Navbar
