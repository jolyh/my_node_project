import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRoutes.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const apiRoutes = (app, controllers) => {

    app.post('/api/logout', controllers.loginController.logout.bind(controllers.loginController));
    app.use('/api/login', authRoutes(controllers.loginController, controllers.userController));

    // Apply authMiddleware to all /api routes except for /api/login and /api/logout
    app.all('/api/{*splat}', authMiddleware, (req, res, next) => {
        next();
    });

    app.use('/api/users', userRoutes(controllers.userController, controllers.usersController));
    app.use('/api/orders', orderRoutes(controllers.orderController, controllers.ordersController));

};

export default apiRoutes;
