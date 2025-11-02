import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Github } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithMagicLink, signInWithOAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, username)
        toast.success('Account created! Please check your email.')
      } else {
        await signIn(email, password)
        toast.success('Signed in successfully!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setLoading(true)
    try {
      await signInWithMagicLink(email)
      toast.success('Check your email for the magic link!')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'github' | 'google') => {
    try {
      await signInWithOAuth(provider)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="yourusername"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleMagicLink}
          className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50"
        >
          Send Magic Link
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleOAuth('github')}
          className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <Github className="h-5 w-5" />
          GitHub
        </button>
        <button
          onClick={() => handleOAuth('google')}
          className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50"
        >
          Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary-600 font-semibold hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}
