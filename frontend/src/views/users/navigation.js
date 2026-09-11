
import router from '@/router/router.js';

const usersNavigation = {
    goToUsers: () => router.push("/users"),
    goToUser: (userId) => router.push(`/users/${userId}`),
    goToUserTasks: (userId) => router.push(`/users/${userId}/tasks`),
    goToUserOrders: (userId) => router.push(`/users/${userId}/orders`)
}

export default usersNavigation