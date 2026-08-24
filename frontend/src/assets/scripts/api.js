import router from '@/router';
import session from './session.js';

const request = async (path, options = {}) => {
    const requestHeaders = new Headers(options.headers || {});

    if (options.body && !requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
        requestHeaders.set("Accept", "application/json");
        requestHeaders.set("Access-Control-Allow-Origin", "*");
    }
    
    const token = session.token.get();
    if (token) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(path, {
        ...options,
        headers: requestHeaders
    });

    console.log(`[DEBUG] API request to ${path} returned status ${response.status}.`);
    console.log("response:", response);

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    console.log(`[DEBUG] API request to ${path} returned status ${response.status}.`);
    console.log("response:", result);

    if (response.status === 401) {
        console.warn("[WARNING] Unauthorized access detected. Clearing session token and redirecting to login.");
        session.clear();
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

const apiBaseUrl = "/api"

const api = {

    token: {
        async refresh() {
            return request(`${apiBaseUrl}/token/refresh`, { method: "POST" });
        }
    },

    auth: {
        async login(email, password) {
            const result = await request(`${apiBaseUrl}/login/`, {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            session.token.set(result.token);
            session.currentUser.set(result.user);
            return result;
        },
        async signup(name, email, password) {
            return request(`${apiBaseUrl}/login/signup`, {
                method: "POST",
                body: JSON.stringify({ name, email, password })
            });
        },
        async logout() {
            try {
                await request(`${apiBaseUrl}/logout`, { method: "POST" });
            } finally {
                session.clear();
            }
        }
    },
    users: {
        me() {
            return request(`${apiBaseUrl}/users/me`);
        },
        list() {
            return request(`${apiBaseUrl}/users/all`);
        },
        create(user) {
            return request(`${apiBaseUrl}/users`, {
                method: "POST",
                body: JSON.stringify(user)
            });
        },
        get(id) {
            return request(`${apiBaseUrl}/users/${id}`);
        },
        update(id, user) {
            return request(`${apiBaseUrl}/users/${id}`, {
                method: "PUT",
                body: JSON.stringify(user)
            });
        },
        remove(id) {
            return request(`${apiBaseUrl}/users/${id}`, {
                method: "DELETE"
            });
        },
        orders(id) {
            return request(`${apiBaseUrl}/users/${id}/orders`);
        }
    },
    orders: {
        list() {
            return request(`${apiBaseUrl}/orders/all`);
        },
        get(id) {
            return request(`${apiBaseUrl}/orders/${id}`);
        },
        create(order) {
            return request(`${apiBaseUrl}/orders`, {
                method: "POST",
                body: JSON.stringify(order)
            });
        },
        update(id, order) {
            return request(`${apiBaseUrl}/orders/${id}`, {
                method: "PUT",
                body: JSON.stringify(order)
            });
        },
        remove(id) {
            return request(`${apiBaseUrl}/orders/${id}`, {
                method: "DELETE"
            });
        }
    }
}

export default api;