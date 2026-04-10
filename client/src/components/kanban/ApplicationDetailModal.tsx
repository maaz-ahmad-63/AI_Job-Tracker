import React, { useState } from 'react'
import { Application } from '../../lib/api'
import { X, Edit2, Trash2, ExternalLink, Wand2 } from 'lucide-react'
import { ResumeBulletsGenerator } from '../ai/ResumeBulletsGenerator'

interface ApplicationDetailModalProps {
  application: Application | null
  onClose: () => void
  onEdit: (app: Application) => void
  onDelete: (appId: string) => void
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [showResumeBullets, setShowResumeBullets] = useState(false)

  if (!application) return null

  const statusColor = {
    applied: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    interviewing: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    offered: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    withdrawn: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  }

  const colors = statusColor[application.status] || statusColor.applied

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{application.companyName}</h2>
            <p className="text-lg text-slate-600 mt-1">{application.position}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors p-2 hover:bg-slate-200 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Status Badge */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Status</label>
            <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm border ${colors.bg} ${colors.text} ${colors.border}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">📅 Applied Date</label>
              <p className="text-slate-900 font-medium">{new Date(application.appliedDate).toLocaleDateString()}</p>
            </div>
            {application.salaryRange && (
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">💰 Salary Range</label>
                <p className="text-slate-900 font-medium">
                  {typeof application.salaryRange === 'string'
                    ? application.salaryRange
                    : `$${application.salaryRange?.min || 0}k - $${application.salaryRange?.max || 0}k`}
                </p>
              </div>
            )}
          </div>

          {/* Job Description Link */}
          {application.jdLink && (
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">🔗 Job Description</label>
              <a
                href={application.jdLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                View Full JD
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">📝 Notes</label>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700">
                {application.notes}
              </div>
            </div>
          )}

          {/* Resume Bullets Generator */}
          {showResumeBullets && application.position && application.companyName && (
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 size={20} className="text-purple-600" />
                <h3 className="font-semibold text-slate-900">AI-Generated Resume Bullets</h3>
              </div>
              <ResumeBulletsGenerator
                position={application.position}
                companyName={application.companyName}
                responsibilities={[]}
                skills={[]}
              />
            </div>
          )}

          {/* Generate Resume Bullets Button */}
          {!showResumeBullets && (
            <button
              onClick={() => setShowResumeBullets(true)}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Wand2 size={18} />
              Generate Resume Bullets
            </button>
          )}

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500 space-y-1">
            <p>Created: {new Date(application.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(application.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onEdit(application)
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this application?')) {
                onDelete(application._id)
                onClose()
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailModal
