import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applicationAPI, Application, CreateApplicationData } from './api'

interface User {
  id: string
  email: string
}

interface AuthStore {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User | null) => void
}

interface ApplicationStore {
  applications: Application[]
  selectedApplication: Application | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchApplications: () => Promise<void>
  createApplication: (data: CreateApplicationData) => Promise<Application>
  updateApplication: (id: string, data: Partial<CreateApplicationData>) => Promise<Application>
  deleteApplication: (id: string) => Promise<void>
  selectApplication: (app: Application | null) => void
  setError: (error: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ isAuthenticated: true, token, user })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ isAuthenticated: false, token: null, user: null })
      },
      setUser: (user: User | null) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }
        set({ user })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
)

export const useApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],
  selectedApplication: null,
  isLoading: false,
  error: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await applicationAPI.getAll()
      set({ applications: response.data })
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch applications'
      set({ error: errorMsg })
      console.error('Error fetching applications:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  createApplication: async (data: CreateApplicationData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await applicationAPI.create(data)
      set((state) => ({
        applications: [...state.applications, response.data],
      }))
      return response.data
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create application'
      set({ error: errorMsg })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateApplication: async (id: string, data: Partial<CreateApplicationData>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await applicationAPI.update(id, data)
      set((state) => ({
        applications: state.applications.map((app) =>
          app._id === id ? response.data : app
        ),
        selectedApplication:
          state.selectedApplication?._id === id ? response.data : state.selectedApplication,
      }))
      return response.data
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update application'
      set({ error: errorMsg })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteApplication: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await applicationAPI.delete(id)
      set((state) => ({
        applications: state.applications.filter((app) => app._id !== id),
        selectedApplication:
          state.selectedApplication?._id === id ? null : state.selectedApplication,
      }))
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to delete application'
      set({ error: errorMsg })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  selectApplication: (app: Application | null) => {
    set({ selectedApplication: app })
  },

  setError: (error: string | null) => {
    set({ error })
  },
}))
