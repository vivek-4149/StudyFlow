function Navbar({ theme, onToggleTheme, userName = 'Student', onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">StudyFlow</div>

      <div className="navbar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>

        <span className="navbar-user" title={userName}>
          {userName}
        </span>

        <button type="button" className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </nav>
  )
}

export default Navbar
