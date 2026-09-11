import router from '@/router/router.js';

import authNavigation from '@/views/auth/navigation';
import adminNavigation from '@views/admin/navigation.js'
import ordersNavigation from '@views/orders/navigation.js'
import usersNavigation from '@views/users/navigation.js'
import tasksNavigation from '@/views/tasks/navigation';

const navigation = {
    goToHome: () => router.push("/"),
    // Authentication navigation
    ...authNavigation,
    ...adminNavigation,

    ...ordersNavigation,
    ...tasksNavigation,
    ...usersNavigation,
};

export default navigation;