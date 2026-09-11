import { createRouter, createWebHistory } from 'vue-router'
import session from '../stores/session.js'
import { shouldRedirect } from './router.utils.js'

import authRoutes from '../views/auth/routes.js'
import adminRoutes from '../views/admin/routes.js'
import usersRoutes from '../views/users/routes.js'
import ordersRoutes from '../views/orders/routes.js'
import tasksRoutes from '../views/tasks/routes.js'

import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false, showInHeader: false }
  },
  ...authRoutes,
  ...adminRoutes,
  ...usersRoutes,
  ...ordersRoutes,
  ...tasksRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { requiresAuth: false }
  }
];

console.log("Full router", routes)

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

// 🛡️ Global Navigation Guard
router.beforeEach(async (to, from) => {

  console.log(`Navigating to: ${to.fullPath} from: ${from.fullPath}`);

  if (to.fullPath == "/") {
    return true;
  }

  if (to.fullPath == from.fullPath) {
    return false
  }

  // This way
  const isAuthenticated = session.isAuthenticated();
  const currentUser = session.getUser();
  console.log("Current user:", currentUser);

  return shouldRedirect(to, currentUser, isAuthenticated);

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