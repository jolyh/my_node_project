import router from '@/router';
import session from './session.js';

const navigation = {
    goToHome: () => router.push("/"),
    // Authentication navigation
    goToLogin: () => router.push("/login"),
    goToLogout: () => router.push("/logout"),
    goToSignup: () => router.push("/signup"),
    // User navigation
    goToUsers: () => router.push("/users"),
    goToUserDetails: (userId) => router.push(`/users/${userId}`),
    goToUserEdit: (userId) => router.push(`/users/${userId}/edit`),
    goToUserCreate: () => router.push("/users/create"),
    // Orders navigation
    goToOrders: () => router.push("/orders"),
    goToOrderDetails: (orderId) => router.push(`/orders/${orderId}`),
    goToOrderEdit: (orderId) => router.push(`/orders/${orderId}/edit`),
    goToOrderCreate: () => router.push("/orders/create"),
};

export default navigation;