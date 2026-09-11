
import apiRouter from '#routers/api.router';
import webRouter from '#routers/web.router';
import requestMiddleware from '#middleware/request.middleware';
import errorHandler from '#middleware/error.middleware';

const mainRouterInit = (
    express,
    app,
    controllers,
    baseDir,
    onCriticalError
) => {

    app.use(requestMiddleware);
    apiRouter(app, controllers);
    webRouter(app, express, baseDir);
    app.use(errorHandler(onCriticalError));

    return app

}

export default mainRouterInit
