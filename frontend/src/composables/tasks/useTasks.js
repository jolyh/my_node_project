import { useTask } from './useTask.js'
import { useLane, taskStatuses } from './useLane.js'

export function useTasks(authorId = null) {
    const taskComposables = useTask(authorId)
    const laneComposables = useLane({
        tasks: taskComposables.tasks,
        moveTask: taskComposables.moveTask
    })

    return {
        ...taskComposables,
        ...laneComposables,
        taskStatuses
    }
}

