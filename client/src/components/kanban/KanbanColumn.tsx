import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Application } from '../../lib/api'
import KanbanCard from './KanbanCard'
import { StatusType } from './KanbanBoard'

interface ColumnConfig {
  id: StatusType
  label: string
  color: string
}

interface KanbanColumnProps {
  column: ColumnConfig
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (appId: string) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, applications, onEdit, onDelete }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  const getHeaderColor = (status: StatusType) => {
    const colors = {
      applied: 'bg-gradient-to-r from-blue-600 to-blue-700',
      interviewing: 'bg-gradient-to-r from-amber-600 to-amber-700',
      offered: 'bg-gradient-to-r from-purple-600 to-purple-700',
      rejected: 'bg-gradient-to-r from-red-600 to-red-700',
      withdrawn: 'bg-gradient-to-r from-slate-600 to-slate-700',
    }
    return colors[status] || colors.applied
  }

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`${getHeaderColor(column.id)} text-white p-4 rounded-t-lg shadow-md`}>
        <h2 className="font-bold text-lg">
          {column.label}
          <span className="ml-2 bg-white bg-opacity-25 px-3 py-1 rounded-full inline-block text-sm font-semibold backdrop-blur-sm">
            {applications.length}
          </span>
        </h2>
      </div>

      <div
        ref={setNodeRef}
        className="bg-slate-50 rounded-b-lg p-4 min-h-96 space-y-3 border-2 border-slate-300 border-t-0"
      >
        <SortableContext items={applications.map(app => app._id)} strategy={verticalListSortingStrategy}>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-medium">No applications</p>
              <p className="text-xs mt-1">Drag cards here</p>
            </div>
          ) : (
            applications.map(app => (
              <KanbanCard key={app._id} application={app} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export default KanbanColumn
