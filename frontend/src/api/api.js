import router from '@/router/router.js';
import session from '@/stores/session.js';

//#region Request Wrapper
const request = async (path, options = {}) => {
    const requestHeaders = new Headers(options.headers || {});

    if (options.body && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
        requestHeaders.set("Accept", "application/json");
        requestHeaders.set("Access-Control-Allow-Origin", "*");
    }
    
    const token = session.getToken();
    if (token) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(path, {
        ...options,
        headers: requestHeaders
    });

    //console.log(`[DEBUG] API request to ${path} returned status ${response.status}.`);
    //console.log("response:", response);

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    //console.log(`[DEBUG] API request to ${path} returned status ${response.status}.`);
    //console.log("response:", result);

    if (response.status === 401) {
        console.warn("[WARNING] Unauthorized access detected. Clearing session token and redirecting to login.");
        session.logout();
        router.push("/login");
        throw new Error("Unauthorized access. Please log in again.", { cause: { status: 401, message: "Unauthorized access" } });
    }

    if (!response.ok) {
        const error = result;
        const message = error.message || error.statusText || "An error occurred";
        throw new Error(message || response.statusText);
    }
    return result;
}
//#endregion

import { apis, apiBasePath } from '#shared/api.js';
const apiBaseUrl = apiBasePath

const api = {

    token: {
        async refresh() {
            return request(`${apiBaseUrl}/token/refresh`, { method: "POST" });
        }
    },

    auth: {
        async login(email, password) {
            const result = await request(apis.auth.login.path, {
                method: apis.auth.login.method,
                body: JSON.stringify({ email, password })
            });
            session.login(result.user, result.token, result.expireAt)
            return result;
        },
        async signup(name, email, password) {
            return request(apis.auth.signup.path, {
                method: apis.auth.signup.method,
                body: JSON.stringify({ name, email, password })
            });
        },
        async logout() {
            try {
                await request(apis.auth.logout.path, { method: apis.auth.logout.method });
            } finally {
                session.logout();
            }
        }
    },
    users: {
        me() {
            return request(apis.users.me.path, { method: apis.users.me.method });
        },
        list() {
            return request(apis.users.list.path, { method: apis.users.list.method });
        },
        create(user) {
            return request(apis.users.create.path, {
                method: apis.users.create.method,
                body: JSON.stringify(user)
            });
        },
        get(id) {
            return request(apis.users.get(id).path, { method: apis.users.get(id).method });
        },
        update(id, user) {
            return request(apis.users.update(id).path, {
                method: apis.users.update(id).method,
                body: JSON.stringify(user)
            });
        },
        remove(id) {
            return request(apis.users.delete(id).path, {
                method: apis.users.delete(id).method
            });
        },
        // Get for a specific user
        orders(id) {
            return request(apis.users.orders(id).path, { method: apis.users.orders(id).method });
        },
        tasks(id) {
            return request(apis.users.tasks(id).path, { method: apis.users.tasks(id).method });
        }
    },
    orders: {
        list() {
            return request(apis.orders.list.path, { method: apis.orders.list.method });
        },
        get(id) {
            return request(apis.orders.get(id).path, { method: apis.orders.get(id).method });
        },
        create(order) {
            return request(apis.orders.create.path, {
                method: apis.orders.create.method,
                body: JSON.stringify(order)
            });
        },
        update(id, order) {
            return request(apis.orders.update(id).path, {
                method: apis.orders.update(id).method,
                body: JSON.stringify(order)
            });
        },
        remove(id) {
            return request(apis.orders.delete(id).path, {
                method: apis.orders.delete(id).method
            });
        }
    },
    tasks: {
        list() {
            return request(apis.tasks.list.path, { method: apis.tasks.list.method });
        },
        get(id) {
            return request(apis.tasks.get(id).path, { method: apis.tasks.get(id).method });
        },
        create(task) {
            return request(apis.tasks.create.path, {
                method: apis.tasks.create.method,
                body: JSON.stringify(task)
            });
        },
        update(id, task) {
            return request(apis.tasks.update(id).path, {
                method: apis.tasks.update(id).method,
                body: JSON.stringify(task)
            });
        },
        remove(id) {
            return request(apis.tasks.delete(id).path, {
                method: apis.tasks.delete(id).method
            });
        }
    }
}

export default api;