import { computed } from 'vue'
import { taskStatus } from '#shared/task.js'

// Format label from enum key (e.g. IN_PROGRESS -> In progress)
const formatStatusLabel = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1).toLowerCase().replace(/_/g, ' ')

// Dynamic statuses from shared enum sorted low to high
export const taskStatuses = Object.entries(taskStatus)
  .map(([key, value]) => ({
    value,
    label: formatStatusLabel(key)
  }))
  .sort((a, b) => a.value - b.value)

export function useLane({ tasks, moveTask, onError } = {}) {
  const groupedByStatus = computed(() =>
    taskStatuses.map((status) => ({
      ...status,
      tasks: (tasks?.value ?? []).filter((task) => Number(task.status) === status.value)
    }))
  )

  const onDragStart = (event, task) => {
    event.dataTransfer.setData('text/plain', String(task.id))
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = async (event, status) => {
    const id = Number(event.dataTransfer.getData('text/plain'))
    if (!id || !moveTask) return
    const { success } = await moveTask(id, status)
    if (!success && onError) onError()
  }

  return {
    taskStatuses,
    groupedByStatus,
    onDragStart,
    onDrop
  }
}
