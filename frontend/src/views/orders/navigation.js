
import router from '@/router/router.js';

const ordersNavigation = {
    goToOrders: () => router.push("/orders"),
    goToOrder: (orderId) => router.push(`/orders/${orderId}`),
}

export default ordersNavigation