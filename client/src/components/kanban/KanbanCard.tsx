import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Application } from '../../lib/api'
import { Edit2, Trash2 } from 'lucide-react'

interface KanbanCardProps {
  application: Application
  onEdit: (app: Application) => void
  onDelete: (appId: string) => void
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ application, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const statusColor = {
    applied: 'border-l-4 border-blue-600',
    interviewing: 'border-l-4 border-amber-600',
    offered: 'border-l-4 border-purple-600',
    rejected: 'border-l-4 border-red-600',
    withdrawn: 'border-l-4 border-slate-600',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(application)}
      className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-grab active:cursor-grabbing border border-slate-200 ${statusColor[application.status] || statusColor.applied}`}
    >
      <div className="mb-3">
        <h3 className="font-bold text-slate-900 truncate text-base">{application.companyName}</h3>
        <p className="text-sm text-slate-600 truncate font-medium">{application.position}</p>
      </div>

      <div className="text-xs text-slate-500 mb-3 space-y-1 pb-3 border-b border-slate-200">
        <p>📅 {new Date(application.appliedDate).toLocaleDateString()}</p>
        {application.salaryRange && (
          <p>
            💰{' '}
            {typeof application.salaryRange === 'string'
              ? application.salaryRange
              : `$${application.salaryRange?.min || 0}k - $${application.salaryRange?.max || 0}k`}
          </p>
        )}
      </div>

      {application.notes && (
        <p className="text-xs text-slate-700 mb-3 line-clamp-2 italic bg-slate-50 p-2 rounded">{application.notes}</p>
      )}

      <div className="flex gap-2 justify-end pt-2">
        <button
          onClick={() => onEdit(application)}
          className="p-2 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded transition-colors border border-blue-200 hover:border-blue-300"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(application._id)}
          className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded transition-colors border border-red-200 hover:border-red-300"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default KanbanCard
