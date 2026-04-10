import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useApplicationStore } from '../lib/store'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import { Plus, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isLoading, error, fetchApplications, applications } = useApplicationStore()

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleAddApplication = () => {
    navigate('/add-application')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Calculate statistics
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    offered: applications.filter(a => a.status === 'offered').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-full px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Application Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleAddApplication}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <Plus size={20} />
              Add Application
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-full px-6 py-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-slate-700 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-900 rounded-lg p-4 text-center">
              <p className="text-blue-300 text-sm">Applied</p>
              <p className="text-3xl font-bold text-blue-100 mt-1">{stats.applied}</p>
            </div>
            <div className="bg-yellow-900 rounded-lg p-4 text-center">
              <p className="text-yellow-300 text-sm">Phone Screen</p>
              <p className="text-3xl font-bold text-yellow-100 mt-1">{stats.interviewing}</p>
            </div>
            <div className="bg-purple-900 rounded-lg p-4 text-center">
              <p className="text-purple-300 text-sm">Interview</p>
              <p className="text-3xl font-bold text-purple-100 mt-1">{stats.offered}</p>
            </div>
            <div className="bg-red-900 rounded-lg p-4 text-center">
              <p className="text-red-300 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-100 mt-1">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-full px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
            <p className="text-white mt-4 text-lg">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-100">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>
    </div>
  )
}
