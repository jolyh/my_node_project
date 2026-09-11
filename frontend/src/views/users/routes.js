
import TasksView from '@views/tasks/TasksView.vue'
import UsersView from '@views/users/UsersView.vue'
import UserDetailsView from '@views/users/UserDetailsView.vue'
import { userRole } from '#shared/user.js'

const usersRoutes = [
  {
    path: '/users/',
    name: 'Users',
    component: UsersView,
    meta: {
      requiresAuth: true,
      requiresRole: userRole.USER,
      showInHeader: true
    }
  },
  {
    path: '/users/:id',
    name: 'User',
    component: UserDetailsView,
    meta: {
      requiresAuth: true,
      requiresRole: userRole.END_USER,
      orRequiresSameId: true,
      showInHeader: false
    }
  },
  {
    path: '/users/:id/orders',
    name: 'User orders',
    component: TasksView,
    meta: {
      requiresAuth: true,
      requiresRole: userRole.END_USER,
      orRequiresSameId: true,
      showInHeader: false
    }
  },
  {
    path: '/users/:id/tasks',
    name: 'User tasks',
    component: TasksView,
    meta: {
      requiresAuth: true,
      requiresRole: userRole.END_USER,
      orRequiresSameId: true,
      showInHeader: false
    }
  },
]

export default usersRoutes