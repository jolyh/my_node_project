
import AdminDashboardView from '@views/admin/AdminDashboardView.vue'

const adminRoutes = [
  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboardView, // TODO
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      showInHeader: true
    }
  },
]

export default adminRoutes