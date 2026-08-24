import { createRouter, createWebHistory } from 'vue-router'
import session from './assets/scripts/session.js'

import HomeView from './views/HomeView.vue'
import LoginView from './views/LoginView.vue'
import LogoutView from './views/LogoutView.vue'
import UsersView from './views/UsersView.vue'
import UserDetailsView from './views/UserDetailsView.vue'
import OrdersView from './views/OrdersView.vue'

const routes = [
  {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: UserDetailsView,
      meta: { requiresAuth: true, requiresSameId: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: { requiresAuth: true }
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

const isAuthenticated = () => {
  const token = session.token.get();
  return token !== null;
}

const currentUser = () => {
  const user = session.currentUser.get();
  return user;
}

const currentUserRole = () => {
  const user = currentUser();
  return user ? user.role : null;
}

const currentUserId = () => {
  const user = currentUser();
  return user ? user.id : null;
}

// 🛡️ Global Navigation Guard
router.beforeEach(async (to, from) => {

  console.log(`Navigating to: ${to.fullPath} from: ${from.fullPath}`);

  const loggedIn = isAuthenticated()
  const role = currentUserRole()

  // 1. Check if route requires authentication
  if (to.meta.requiresAuth && !loggedIn) {
    console.log('User not authenticated; redirecting to login page.');
    return { name: 'login' } // Redirect to login if not authenticated
  }

  // 2. Check if route requires admin permissions
  if (to.meta.requiresAdmin && role !== 'admin') {
    console.log('User does not have admin permissions; redirecting to home page.');
    return { name: 'home' } // Redirect to home if not an admin
  }

  // 3. Check if route requires the same user ID
  if (to.meta.requiresSameId) {
    const userId = currentUserId();
   if (to.params.id !== String(userId)) {
      console.log(`User ID mismatch; redirecting to home page. Expected: ${userId}, Found: ${to.params.id}`);
      return { name: 'home' } // Redirect if user ID doesn't match
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