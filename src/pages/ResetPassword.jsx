import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setSuccess(false)

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (!data.session) {
        setMessage(
          'Reset session not found. Please request a new password reset link.'
        )
        return
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setSuccess(true)
      setMessage('Your password has been updated successfully.')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage(error.message || 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="reset-page">
      <div className="reset-glow reset-glow-one" />
      <div className="reset-glow reset-glow-two" />

      <section className="reset-card">
        <Link to="/" className="reset-brand" aria-label="StudyFlow home">
          <span className="reset-brand-icon">S</span>
          <span>Study<span>Flow</span></span>
        </Link>

        <div className="reset-icon" aria-hidden="true">
          {success ? '✓' : '🔐'}
        </div>

        <p className="reset-eyebrow">
          {success ? 'ALL SET' : 'ACCOUNT RECOVERY'}
        </p>

        <h1>{success ? 'Password Updated!' : 'Create New Password'}</h1>

        <p className="reset-description">
          {success
            ? 'Your account is secure with your new password. You can now return to StudyFlow.'
            : 'Choose a strong password to get back into your StudyFlow account.'}
        </p>

        {!success && (
          <form className="reset-form" onSubmit={handleSubmit}>
            <div className="reset-field">
              <label htmlFor="new-password">New password</label>
              <div className="reset-input-wrap">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="reset-visibility"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="reset-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <div className="reset-input-wrap">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter it one more time"
                  required
                />
                <button
                  type="button"
                  className="reset-visibility"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="reset-password-hint">
              <span>ⓘ</span>
              Use at least 6 characters for your password.
            </div>

            <button className="reset-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="reset-spinner" />
                  Updating password...
                </>
              ) : (
                <>
                  Update Password <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>
        )}

        {message && (
          <div
            role="status"
            className={`reset-message ${success ? 'reset-message-success' : 'reset-message-error'}`}
          >
            <span aria-hidden="true">{success ? '✓' : '!'}</span>
            <p>{message}</p>
          </div>
        )}

        <div className="reset-footer">
          <Link to="/">← Back to StudyFlow</Link>
          <p>STUDY SMART. STAY CONSISTENT.</p>
        </div>
      </section>

      <p className="reset-bottom-note">
        <span aria-hidden="true">🔒</span> Your account security matters.
      </p>
    </main>
  )
}

export default ResetPassword
