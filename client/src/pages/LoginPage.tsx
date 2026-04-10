import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import { useAuthStore } from '../lib/store'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      console.log('Login attempt with email:', data.email)
      console.log('API Base URL:', (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api')
      const res = await api.post('/auth/login', data)
      return res.data
    },
    onSuccess: (data) => {
      console.log('Login successful, user:', data.user)
      setError(null)
      login(data.token, data.user)
      navigate('/dashboard')
    },
    onError: (error: any) => {
      console.error('Login error:', error.message, error.response?.data)
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.')
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Job Application Tracker
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
