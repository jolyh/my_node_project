const orderToCreate = {
    userId: 1,
    productId: 42,
    quantity: 3,
    totalPrice: 74.97,
    status: 2,
    deliveryDate: "2030-01-15 12:00:00"
};

const orderToUpdate = {
    ...orderToCreate,
    productId: 43,
    quantity: 4,
    totalPrice: 99.96,
    status: 3
};

const orderRequest = {
    userId: 1,
    productId: 42,
    quantity: 2,
    totalPrice: 49.98,
    status: 0,
    deliveryDate: "2030-01-15"
};

export { orderToCreate, orderToUpdate, orderRequest };
