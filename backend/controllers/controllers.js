
import UserController from './users/UserController.js';
import UsersController from './users/UsersController.js';
import OrderController from './orders/OrderController.js';
import OrdersController from './orders/OrdersController.js';

import AuthController from './auth/AuthController.js';
import { AppError, errorTypes } from '../errors/AppError.js';

const controllers = async (services) => {

    const controllers = {};

    try {

        const orderController = new OrderController(services.orderService);
        const ordersController = new OrdersController(services.orderService);
        controllers.orderController = orderController;
        controllers.ordersController = ordersController;

        const userController = new UserController(services.userService, services.orderService);
        const usersController = new UsersController(services.userService);
        controllers.userController = userController;
        controllers.usersController = usersController;

        const loginController = new AuthController(services.authService);
        controllers.loginController = loginController;

        return controllers;

    } catch (error) {
        throw new AppError(
            errorTypes.CRITICAL.CONTROLLERS_FAILED_TO_INITIALIZE,
            'Failed to initialize controllers: ' + (error.message ? ': ' + error.message : '')
        );
    }
};

export default controllers;
