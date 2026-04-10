import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApplicationStore } from '../lib/store'
import { CreateApplicationData, ParsedJobDescription } from '../lib/api'
import JDParser from '../components/ai/JDParser'

export default function AddApplicationPage() {
  const navigate = useNavigate()
  const { createApplication, isLoading, error, setError } = useApplicationStore()
  
  const [formData, setFormData] = useState<CreateApplicationData>({
    companyName: '',
    position: '',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    jdLink: '',
    notes: '',
    salaryRange: { min: undefined, max: undefined },
    seniority: '',
    location: '',
  })

  const [localError, setLocalError] = useState('')

  const handleParsedJD = (parsed: ParsedJobDescription) => {
    setFormData((prev) => ({
      ...prev,
      companyName: parsed.companyName || prev.companyName,
      position: parsed.position || prev.position,
      jdLink: parsed.jdLink || prev.jdLink,
      seniority: parsed.seniority || prev.seniority,
      location: parsed.location || prev.location,
      salaryRange: parsed.salaryRange
        ? {
            min: prev.salaryRange?.min,
            max: prev.salaryRange?.max,
          }
        : prev.salaryRange,
      notes: parsed.summary ? `${prev.notes}\n\nKey Skills: ${parsed.requiredSkills.join(', ')}\n\nSummary: ${parsed.summary}` : prev.notes,
    }))
    setLocalError('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'minSalary' || name === 'maxSalary') {
      setFormData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name === 'minSalary' ? 'min' : 'max']: value ? parseInt(value) : undefined,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    setError(null)

    // Validation
    if (!formData.companyName.trim()) {
      setLocalError('Company name is required')
      return
    }
    if (!formData.position.trim()) {
      setLocalError('Position is required')
      return
    }
    if (!formData.appliedDate) {
      setLocalError('Applied date is required')
      return
    }

    try {
      // Convert salaryRange object to string format
      const dataToSubmit = {
        ...formData,
        salaryRange: formData.salaryRange?.min || formData.salaryRange?.max 
          ? `$${formData.salaryRange?.min || 0}k - $${formData.salaryRange?.max || 0}k`
          : undefined
      }
      await createApplication(dataToSubmit)
      navigate('/dashboard')
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Failed to create application')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Application</h1>

          {(localError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{localError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AI JD Parser */}
            <JDParser onParse={handleParsedJD} onError={setLocalError} />

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Google, Meta, Microsoft"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Seniority Level */}
            <div>
              <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 mb-2">
                Seniority Level
              </label>
              <select
                id="seniority"
                name="seniority"
                value={formData.seniority || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Auto-detected</option>
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Staff">Staff</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA (Remote OK)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Applied Date */}
            <div>
              <label htmlFor="appliedDate" className="block text-sm font-medium text-gray-700 mb-2">
                Applied Date *
              </label>
              <input
                type="date"
                id="appliedDate"
                name="appliedDate"
                value={typeof formData.appliedDate === 'string' ? formData.appliedDate : formData.appliedDate.toISOString().split('T')[0]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Job Description Link */}
            <div>
              <label htmlFor="jdLink" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description Link
              </label>
              <input
                type="url"
                id="jdLink"
                name="jdLink"
                value={formData.jdLink || ''}
                onChange={handleChange}
                placeholder="https://example.com/job-posting"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Salary (USD)
                </label>
                <input
                  type="number"
                  id="minSalary"
                  name="minSalary"
                  value={formData.salaryRange?.min || ''}
                  onChange={handleChange}
                  placeholder="100000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Salary (USD)
                </label>
                <input
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  value={formData.salaryRange?.max || ''}
                  onChange={handleChange}
                  placeholder="150000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Any additional notes about this application..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </>
                ) : (
                  'Create Application'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
