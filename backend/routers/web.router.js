import fs from 'fs/promises';
import path from 'path';
import { requireAuthentication } from '#middleware/auth.middleware';
import Logger from '#utils/Logger';

const page = (baseDir, name) => async (req, res, next) => {
    try {
        const filePath = path.join(baseDir, 'client', name);
        const html = await fs.readFile(filePath, 'utf8');
        res.type('html').send(html);
    } catch (error) {
        next(error);
    }
};

const vueRoutes = (app, express, baseDir) => {// Vue.js SPA route handling
    //app.use(express.static(path.join(baseDir, 'frontend', 'dist'))); // for built 
    app.use(express.static(path.join(baseDir, 'frontend', 'dist')));

    // 3. Handle any routing requests by serving the main index.html
    app.get('{*splat}', (req, res) => {
        res.sendFile(path.join(baseDir, 'frontend', 'dist', 'index.html'));
    });
}

const nativeRoutes = (app, express, baseDir) => {
    app.use('/client', express.static(path.join(baseDir, 'client')));
    app.use('/client/css', express.static(path.join(baseDir, 'client/assets/css')));

    app.get('/', page(baseDir, 'home.html'));
    app.get('/home', page(baseDir, 'home.html'));
    app.get('/logout', page(baseDir, 'logout.html'));
    app.get('/login', page(baseDir, 'login.html'));
    app.get('/users', requireAuthentication, page(baseDir, 'users.html'));
    app.get('/orders', requireAuthentication, page(baseDir, 'orders.html'));
};

const webRouter = (app, express, baseDir) => {

    if (process.env.USE_VUE === 'true') {
        Logger.systemInfo('Using Vue.js frontend.');
        vueRoutes(app, express, baseDir);
    } else {
        Logger.systemInfo('Using native HTML frontend.');
        nativeRoutes(app, express, baseDir);
    }

};

export default webRouter;
