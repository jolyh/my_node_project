import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const apiRoutes = (app, controllers) => {

    app.post('/api/logout', controllers.loginController.logout.bind(controllers.loginController));
    app.use('/api/login', authRoutes(controllers.loginController, controllers.userController));
    app.use('/api/users', authMiddleware, userRoutes(controllers.userController, controllers.usersController));
    app.use('/api/orders', authMiddleware, orderRoutes(controllers.orderController, controllers.ordersController));

};

export default apiRoutes;
