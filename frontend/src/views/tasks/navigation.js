
import router from '@/router/router.js';

const tasksNavigation = {
    goToTasks: () => router.push("/tasks"),
    goToTask: (taskId) => router.push(`/tasks/${taskId}`),
}

export default tasksNavigation