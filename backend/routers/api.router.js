import authRoutes from '#routers/api/auth.routes';
import ordersRoutes from '#routers/api/orders.routes';
import usersRoutes from '#routers/api/users.routes';
import tasksRoutes from '#routers/api/tasks.routes';
import { requireAuthentication } from '#middleware/auth.middleware';

const apiRouter = (app, controllers) => {

    app.post('/api/logout', controllers.loginController.logout.bind(controllers.loginController));
    app.use('/api/login', authRoutes(controllers.loginController, controllers.usersController));

    // Apply auth Middleware to all /api routes except for /api/login and /api/logout
    // Only authenticated users can access these routes
    app.all('/api/{*splat}', requireAuthentication, (req, res, next) => {
        next();
    });

    app.use('/api/users', usersRoutes(controllers.usersController));
    app.use('/api/orders', ordersRoutes(controllers.ordersController));
    app.use('/api/tasks', tasksRoutes(controllers.tasksController));

    // Catch-all route for undefined API endpoints and return a 404 error
    app.all('/api/{*splat}', (req, res, next) => {
        res.status(404).json({ error: 'API route not found' });
    });

};

export default apiRouter;
