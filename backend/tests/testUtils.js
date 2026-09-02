const emptyUserController = () => ({
    async createUser() {},
    async getCurrentUser() {},
    async findUser() {},
    async updateUser() {},
    async deleteUser() {},
    async listOrders() {}
});

const emptyUsersController = () => ({
    async list() {}
})

export { emptyUserController, emptyUsersController };