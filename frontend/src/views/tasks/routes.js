
import TasksView from './TasksView.vue'
import { userRole } from '#shared/user.js'

const tasksRoutes = [
  {
    path: '/tasks/',
    name: 'Tasks',
    component: TasksView,
    meta: { 
      requiresAuth: true, 
      requiresRole: userRole.ADMIN, 
      showInHeader: true 
    }
  },
  {
    path: '/tasks/:id',
    name: 'Task',
    component: TasksView,
    meta: { 
      requiresAuth: true, 
      requiresRole: userRole.USER, 
      showInHeader: false 
    }
  },
]

export default tasksRoutes