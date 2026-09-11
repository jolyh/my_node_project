
import AuthController from '#controllers/AuthController';
import UsersController from '#controllers/UsersController';
import OrdersController from '#controllers/OrdersController';
import TasksController from '#controllers/TasksController';

import { AppError, errorTypes } from '#errors/AppError';

const controllers = async (services) => {

    const controllers = {};

    try {

        const ordersController = new OrdersController(services.orderService);
        controllers.ordersController = ordersController;

        const usersController = new UsersController(
            services.userService, 
            services.orderService,
            services.taskService
        );
        controllers.usersController = usersController;

        const loginController = new AuthController(services.authService);
        controllers.loginController = loginController;

        const tasksController = new TasksController(services.taskService);
        controllers.tasksController = tasksController;

        return controllers;

    } catch (error) {
        throw new AppError(
            errorTypes.CRITICAL.CONTROLLERS_FAILED_TO_INITIALIZE,
            'Failed to initialize controllers: ' + (error.message ? ': ' + error.message : '')
        );
    }
};

export default controllers;
