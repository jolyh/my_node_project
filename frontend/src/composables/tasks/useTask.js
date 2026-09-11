import { ref, reactive } from 'vue'
import api from '@api/api.js'
import session from '@stores/session.js'
import { useAsyncAction } from '@composables/useAsyncAction.js'

export const defaultTaskStatus = 0

export function useTask(authorId = null) {
  const tasks = ref([])
  const message = ref('')
  const error = ref('')
  const editingTaskId = ref(null)

  const listAction = useAsyncAction()
  const createAction = useAsyncAction()
  const updateAction = useAsyncAction()
  const deleteAction = useAsyncAction()

  const emptyTaskForm = () => ({
    title: '',
    description: '',
    status: defaultTaskStatus
  })

  const taskForm = reactive(emptyTaskForm())

  const showError = (action) => {
    error.value = action.error.value
  }

  const resetForm = () => {
    editingTaskId.value = null
    Object.assign(taskForm, emptyTaskForm())
  }

  const editTask = (task) => {
    editingTaskId.value = task.id
    Object.assign(taskForm, {
      title: task.title,
      description: task.description ?? '',
      status: Number(task.status)
    })
  }

  const listTasks = async () => {
    const { success, result } = authorId
      ? await listAction.run(api.users.tasks(authorId))
      : await listAction.run(api.tasks.list)
    if (success) tasks.value = result.tasks
    return success
  }

  const createTask = async (taskData) => {
    const { success, result } = await createAction.run(api.tasks.create, taskData)
    if (success) await listTasks()
    return { success, result }
  }

  const updateTask = async (id, taskData) => {
    const { success, result } = await updateAction.run(api.tasks.update, id, taskData)
    if (success) await listTasks()
    return { success, result }
  }

  const moveTask = async (id, status) => {
    const task = tasks.value.find((t) => t.id === id)
    if (!task || Number(task.status) === Number(status)) return { success: true }

    const previousStatus = task.status
    task.status = status

    const { success } = await updateAction.run(api.tasks.update, id, { ...task, status })
    if (!success) task.status = previousStatus
    return { success }
  }

  const deleteTask = async (id) => {
    const { success } = await deleteAction.run(api.tasks.remove, id)
    if (success) tasks.value = tasks.value.filter((task) => task.id !== id)
    return { success }
  }

  const saveTask = async () => {
    const { success } = editingTaskId.value
      ? await updateTask(editingTaskId.value, { ...taskForm })
      : await createTask({
          ...taskForm,
          authorId: authorId ?? session.currentUser.get()?.id
        })

    if (success) {
      message.value = editingTaskId.value ? 'Task updated.' : 'Task created.'
      resetForm()
    } else {
      showError(editingTaskId.value ? updateAction : createAction)
    }
  }

  const removeTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    const { success } = await deleteTask(id)
    if (success) {
      message.value = 'Task deleted.'
      if (editingTaskId.value === id) resetForm()
    } else {
      showError(deleteAction)
    }
  }

  return {
    tasks,
    message,
    error,
    editingTaskId,
    taskForm,
    listAction,
    createAction,
    updateAction,
    deleteAction,
    showError,
    resetForm,
    editTask,
    listTasks,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    saveTask,
    removeTask
  }
}
