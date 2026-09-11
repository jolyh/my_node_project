import orderStatus from '#models/orders/status';

const Order = {
    new: (data) => {
        return {
            id: data.id || null,
            userId: data.user_id || null,
            productId: data.product_id || null,
            quantity: data.quantity || 1,
            totalPrice: data.total_price || 0,
            status: data.status || 1,
            createdAt: data.created_at || new Date(),
            updatedAt: data.updated_at || new Date(),
            deliveryDate: data.delivery_date || null,
        };
    },
    forCreation: (data) => {
        return {
            user_id: data.userId,
            product_id: data.productId,
            quantity: data.quantity,
            total_price: data.totalPrice,
            status: data.status ?? orderStatus.PENDING,
            delivery_date: data.deliveryDate,
        };
    },
    forUpdate: (data) => {
        return {
            user_id: data.userId,
            product_id: data.productId,
            quantity: data.quantity,
            total_price: data.totalPrice,
            status: data.status ?? orderStatus.PENDING,
            delivery_date: data.deliveryDate,
        };
    },
    sanitize: (data) => {
        // Remove sensitive fields like password before sending to client
        return data;
    }
};

export default Order;