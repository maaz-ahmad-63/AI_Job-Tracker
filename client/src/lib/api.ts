import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5002/api'

console.log('🔧 API Base URL configured as:', API_BASE_URL)

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('✅ Token added to request')
  }
  console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.message)
    if (error.response) {
      console.error('Response Status:', error.response.status)
      console.error('Response Data:', error.response.data)
      console.error('Error Message:', error.response.data?.message || 'No error message')
      
      if (error.response.status === 401) {
        console.log('🔐 Unauthorized - clearing auth')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('auth-store')
        window.location.href = '/login'
      }
    } else if (error.request) {
      console.error('No response received:', error.request)
    }
    return Promise.reject(error)
  }
)

// Auth API methods
export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
}

// Application API methods
export interface CreateApplicationData {
  companyName: string
  position: string
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  appliedDate: string | Date
  jdLink?: string
  notes?: string
  salaryRange?: {
    min?: number
    max?: number
  }
  seniority?: string
  location?: string
}

export interface Application extends CreateApplicationData {
  _id: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export const applicationAPI = {
  create: (data: CreateApplicationData) =>
    api.post('/applications', data),
  getAll: () =>
    api.get<Application[]>('/applications'),
  getById: (id: string) =>
    api.get<Application>(`/applications/${id}`),
  update: (id: string, data: Partial<CreateApplicationData>) =>
    api.put<Application>(`/applications/${id}`, data),
  delete: (id: string) =>
    api.delete(`/applications/${id}`),
}

// AI API methods
export interface ParsedJobDescription {
  companyName?: string
  position?: string
  jdLink?: string
  salaryRange?: string
  seniority?: string
  location?: string
  keyResponsibilities: string[]
  requiredSkills: string[]
  niceToHaveSkills: string[]
  summary: string
}

export interface ResumeBullets {
  bullets: string[]
  tips: string[]
}

export const aiAPI = {
  parseJobDescription: (jobDescription: string) =>
    api.post<ParsedJobDescription>('/ai/parse-jd', { jobDescription }),
  generateResumeBullets: (position: string, companyName: string, responsibilities: string[], skills: string[]) =>
    api.post<ResumeBullets>('/ai/resume-bullets', {
      position,
      companyName,
      responsibilities,
      skills,
    }),
}

export default api
