
import router from '@/router/router.js';
import { userRole } from '#shared/user.js'

const toDashboard = (role) => {
    if (role === userRole.ADMIN) {
        return "/admin";
    }
    return "/dashboard";
};

const adminNavigation = {
  goToDashboard: (role) => router.push(toDashboard(role)),
}

export default adminNavigation