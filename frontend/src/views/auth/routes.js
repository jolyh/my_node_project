
import LoginView from './LoginView.vue'
import LogoutView from './LogoutView.vue'

const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { 
      requiresAuth: false, 
      showInHeader: false 
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
    meta: { 
      requiresAuth: true, 
      showInHeader: false 
    }
  }
]

export default authRoutes