import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AddApplicationPage from './pages/AddApplicationPage'
import { useAuthStore } from './lib/store'

const queryClient = new QueryClient()

const App = () => {
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    console.log('🔍 App mounted - Auth state:', { isAuthenticated, user })
    
    // If auth state says authenticated but no token, logout
    const token = localStorage.getItem('token')
    if (isAuthenticated && !token) {
      console.log('⚠️ Auth state mismatch - no token found, logging out')
      logout()
    }
  }, [isAuthenticated, user, logout])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-application"
            element={isAuthenticated ? <AddApplicationPage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
