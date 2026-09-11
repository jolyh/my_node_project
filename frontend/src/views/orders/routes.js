
import OrdersView from './OrdersView.vue'
import { userRole } from '#shared/user.js'

const ordersRoutes = [
  {
    path: '/orders/',
    name: 'Orders',
    component: OrdersView,
    meta: { 
      requiresAuth: true, 
      requiresRole: userRole.ADMIN, 
      showInHeader: true 
    }
  },
  {
    path: '/orders/:id',
    name: 'Order',
    component: OrdersView,
    meta: { 
      requiresAuth: true, 
      requiresRole: userRole.USER, 
      showInHeader: false 
    }
  },
]

export default ordersRoutes