
import apiRoutes from './api/apiRoutes.js';
import webRoutes from './webRoutes.js';
import requestMiddleware from '../middleware/requestMiddleware.js';
import errorHandler from '../middleware/errorHandler.js';

const mainRouterInit = (
    express,
    app,
    controllers,
    baseDir,
    onCriticalError
) => {

    app.use(requestMiddleware);
    apiRoutes(app, controllers);
    webRoutes(app, express, baseDir);
    app.use(errorHandler(onCriticalError));

    return app

}

export default mainRouterInit
