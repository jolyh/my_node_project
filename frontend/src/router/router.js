import { createRouter, createWebHistory } from 'vue-router'
import session from '../stores/session.js'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import UsersView from '../views/UsersView.vue'
import UserDetailsView from '../views/UserDetailsView.vue'
import OrdersView from '../views/OrdersView.vue'

import DashboardView from '../views/DashboardView.vue'

import NotFoundView from '../views/NotFoundView.vue'


const routes = [
  {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: false, showInHeader: false }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { requiresAuth: false, showInHeader: false }
    },
    {
      path: '/logout',
      name: 'Logout',
      component: LogoutView,
      meta: { requiresAuth: true, showInHeader: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, requiresAdmin: true, showInHeader: true }
    },
    {
      path: '/users',
      name: 'Users',
      component: UsersView,
      meta: { requiresAuth: true, showInHeader: true }
    },
    {
      path: '/users/:id',
      name: 'User details',
      component: UserDetailsView,
      meta: { requiresAuth: true, requiresSameId: true, showInHeader: false }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: OrdersView,
      meta: { requiresAuth: true, showInHeader: true }
    },
    // The catch-all 404 route - MUST be at the bottom
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
      meta: { requiresAuth: false }
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 🛡️ Global Navigation Guard
router.beforeEach(async (to, from) => {

  console.log(`Navigating to: ${to.fullPath} from: ${from.fullPath}`);

  const loggedIn = session.isAuthenticated();
  const currentUser = session.currentUser.get();
  const role = currentUser ? currentUser.role : null;

  // 1. Check if route requires authentication
  if (to.meta.requiresAuth && !loggedIn) {
    console.log('User not authenticated; redirecting to login page.');
    return { name: 'Login' } // Redirect to login if not authenticated
  }

  // 2. Check if route requires admin permissions
  if (to.meta.requiresAdmin 
    && currentUser 
    && !session.currentUser.isAdmin() 
    && !session.currentUser.isSystemAdmin()
  ) {
    console.log('User does not have admin permissions; redirecting to home page.');
    return { name: 'Home' } // Redirect to home if not an admin
  }

  // 3. Check if route requires the same user ID
  if (to.meta.requiresSameId) {
    const userId = currentUser ? currentUser.id : null;
    if (to.params.id !== String(userId) && !session.currentUser.isSystemAdmin()) {
      console.log(`User ID mismatch; redirecting to home page. Expected: ${userId}, Found: ${to.params.id}`);
      return { name: 'Home' } // Redirect if user ID doesn't match
    }
  }

  return true // Proceed to the route if all checks pass
})

router.beforeResolve(async to => {
  // You can add additional checks or logging here if needed
  return true
})

router.onError((error) => {
  console.error('Router error:', error);
  // Optionally, you can redirect to an error page or show a notification
  // router.push('/error');
})


export default router