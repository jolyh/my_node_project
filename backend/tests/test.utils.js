const emptyUsersController = () => ({
    async createUser() {},
    async getCurrentUser() {},
    async findUser() {},
    async updateUser() {},
    async deleteUser() {},
    async listOrders() {},
    async listTasks() {},
    async list() {}
});

const emptyOrdersController = () => ({
    async createOrder() {},
    async findOrder() {},
    async updateOrder() {},
    async deleteOrder() {},
    async findByUserId() {},
    async list() {}
});

const emptyTasksController = () => ({
    async createTask() {},
    async findTask() {},
    async updateTask() {},
    async deleteTask() {},
    async findByAuthorId() {},
    async list() {}
});

export { emptyUsersController, emptyOrdersController, emptyTasksController };