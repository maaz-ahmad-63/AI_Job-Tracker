import React, { useState } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Application } from '../../lib/api'
import { useApplicationStore } from '../../lib/store'
import KanbanColumn from './KanbanColumn'
import ApplicationDetailModal from './ApplicationDetailModal'

export type StatusType = 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'

const STATUS_COLUMNS: { id: StatusType; label: string; color: string }[] = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-50' },
  { id: 'interviewing', label: 'Phone Screen', color: 'bg-yellow-50' },
  { id: 'offered', label: 'Interview', color: 'bg-purple-50' },
  { id: 'rejected', label: 'Offer', color: 'bg-green-50' },
  { id: 'withdrawn', label: 'Rejected', color: 'bg-red-50' },
]

export const KanbanBoard: React.FC = () => {
  const { applications, updateApplication, deleteApplication } = useApplicationStore()
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Extract applicationId and status from the drag item
    const appId = active.id.toString()
    const newStatus = over.id as StatusType

    // Find the application
    const app = applications.find(a => a._id === appId)
    if (!app || app.status === newStatus) return

    // Update the application status
    try {
      await updateApplication(appId, {
        ...app,
        status: newStatus,
      })
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const handleEdit = (app: Application) => {
    setSelectedApplication(app)
  }

  const handleDelete = async (appId: string) => {
    try {
      await deleteApplication(appId)
      setSelectedApplication(null)
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  // Group applications by status
  const groupedApplications: Record<StatusType, Application[]> = {
    applied: [],
    interviewing: [],
    offered: [],
    rejected: [],
    withdrawn: [],
  }

  applications.forEach(app => {
    const status = (app.status || 'applied') as StatusType
    if (groupedApplications[status]) {
      groupedApplications[status].push(app)
    }
  })

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="w-full bg-gradient-to-b from-slate-100 to-slate-50 p-6 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
          <div className="flex gap-6 min-w-max pb-4">
            {STATUS_COLUMNS.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                applications={groupedApplications[column.id]}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {/* Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  )
}

export default KanbanBoard
