import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useApplicationStore } from '../lib/store'
import { KanbanBoard } from '../components/kanban/KanbanBoard'
import { FeaturesGrid } from '../components/MagicBento'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-blue-800 shadow-lg">
        <div className="max-w-full px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Application Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleAddApplication}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              Add Application
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-slate-900 border-b border-blue-800">
        <div className="max-w-full px-6 py-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700 hover:border-blue-600 transition">
              <p className="text-slate-400 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700 hover:border-blue-600 transition">
              <p className="text-slate-400 text-sm">Applied</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">{stats.applied}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700 hover:border-blue-600 transition">
              <p className="text-slate-400 text-sm">Phone Screen</p>
              <p className="text-3xl font-bold text-cyan-400 mt-1">{stats.interviewing}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700 hover:border-blue-600 transition">
              <p className="text-slate-400 text-sm">Interview</p>
              <p className="text-3xl font-bold text-teal-400 mt-1">{stats.offered}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700 hover:border-blue-600 transition">
              <p className="text-slate-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Section */}
      <div className="max-w-full px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
            <p className="text-white mt-4 text-lg">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-r from-rose-900 to-red-900 border border-rose-700 rounded-lg p-4 text-rose-100">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>

      {/* Features Grid Section - Below */}
      <div className="max-w-full px-6 py-8">
        {applications.length === 0 && (
          <div className="mb-12">
            <FeaturesGrid />
          </div>
        )}
      </div>
    </div>
  )
}
