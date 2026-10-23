import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        )

        if (error) throw error

        setMessage(
          'If an account exists with this email, a password reset link will be sent.'
        )
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        })

        if (error) throw error

        if (data.session) {
          setMessage('Account created successfully!')
        } else {
          setMessage(
            'Account created! Please confirm your email, then log in.'
          )
        }
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function changeScreen(screen) {
    setIsLogin(screen === 'login')
    setIsForgotPassword(screen === 'forgot')
    setPassword('')
    setMessage('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>StudyFlow</h1>

        <p>
          {isForgotPassword
            ? 'Enter your registered email to reset your password.'
            : isLogin
              ? 'Welcome back! Log in to continue.'
              : 'Create your student account.'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && !isForgotPassword && (
            <>
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                required
              />
            </>
          )}

          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          {!isForgotPassword && (
            <>
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </>
          )}

          {isLogin && !isForgotPassword && (
            <p className="auth-forgot">
              <button
                type="button"
                onClick={() => changeScreen('forgot')}
              >
                Forgot Password?
              </button>
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isForgotPassword
                ? 'Send Reset Link'
                : isLogin
                  ? 'Log In'
                  : 'Create Account'}
          </button>
        </form>

        {message && (
          <p role="status" className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-switch">
          {isForgotPassword ? (
            <>
              Remember your password?{' '}
              <button type="button" onClick={() => changeScreen('login')}>
                Log In
              </button>
            </>
          ) : (
            <>
              {isLogin
                ? "Don't have an account?"
                : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => changeScreen(isLogin ? 'signup' : 'login')}
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  )
}

export default Auth
