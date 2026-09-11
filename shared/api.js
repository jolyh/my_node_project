const apiBasePath = '/api';

const apis = {
    users: {
        list: { method: 'GET', path: `${apiBasePath}/users/all` },
        me: { method: 'GET', path: `${apiBasePath}/users/me` },
        get: (id) => ({ method: 'GET', path: `${apiBasePath}/users/${id}` }),
        orders: (id) => ({ method: 'GET', path: `${apiBasePath}/users/${id}/orders` }),
        create: { method: 'POST', path: `${apiBasePath}/users` },
        update: (id) => ({ method: 'PUT', path: `${apiBasePath}/users/${id}` }),
        delete: (id) => ({ method: 'DELETE', path: `${apiBasePath}/users/${id}` }),
        tasks: (id) => ({ method: 'GET', path: `${apiBasePath}/users/${id}/tasks` })
    },
    orders: {
        list: { method: 'GET', path: `${apiBasePath}/orders/all` },
        get: (id) => ({ method: 'GET', path: `${apiBasePath}/orders/${id}` }),
        create: { method: 'POST', path: `${apiBasePath}/orders` },
        update: (id) => ({ method: 'PUT', path: `${apiBasePath}/orders/${id}` }),
        delete: (id) => ({ method: 'DELETE', path: `${apiBasePath}/orders/${id}` }),
    },
    tasks: {
        list: { method: 'GET', path: `${apiBasePath}/tasks/all` },
        get: (id) => ({ method: 'GET', path: `${apiBasePath}/tasks/${id}` }),
        create: { method: 'POST', path: `${apiBasePath}/tasks` },
        update: (id) => ({ method: 'PUT', path: `${apiBasePath}/tasks/${id}` }),
        delete: (id) => ({ method: 'DELETE', path: `${apiBasePath}/tasks/${id}` })
    },
    auth: {
        signup: { method: 'POST', path: `${apiBasePath}/users/` },
        login: { method: 'POST', path: `${apiBasePath}/login` },
        logout: { method: 'POST', path: `${apiBasePath}/logout` }
    }
};

export { apiBasePath, apis };