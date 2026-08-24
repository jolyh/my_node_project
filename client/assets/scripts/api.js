(() => {
    const request = async (path, options = {}) => {
        const requestHeaders = new Headers(options.headers || {});

        if (options.body && !requestHeaders.has("Content-Type")) {
            requestHeaders.set("Content-Type", "application/json");
        }

        const response = await fetch(path, {
            ...options,
            headers: requestHeaders,
            credentials: "include"
        });

        const contentType = response.headers.get("content-type") || "";
        const result = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            const message = typeof result === "string" ? result : result.message;
            throw new Error(message || response.statusText);
        }

        return result;
    };

    window.api = Object.freeze({
        auth: {
            async login(email, password) {
                return request("/api/login/", {
                    method: "POST",
                    body: JSON.stringify({ email, password })
                });
            },
            async signup(name, email, password) {
                return request("/api/login/signup", {
                    method: "POST",
                    body: JSON.stringify({ name, email, password })
                });
            },
            async logout() {
                try {
                    await request("/api/logout", { method: "POST" });
                } finally {
                    window.localStorage.removeItem("jwtToken");
                }
            }
        },
        users: {
            me() {
                return request("/api/users/me");
            },
            list() {
                return request("/api/users/all");
            },
            create(user) {
                return request("/api/users", {
                    method: "POST",
                    body: JSON.stringify(user)
                });
            },
            get(id) {
                return request(`/api/users/${id}`);
            },
            update(id, user) {
                return request(`/api/users/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(user)
                });
            },
            remove(id) {
                return request(`/api/users/${id}`, {
                    method: "DELETE"
                });
            },
            orders(userId) {
                return request(`/api/users/${userId}/orders`);
            },
            createOrder(userId, order) {
                return request(`/api/users/${userId}/orders`, {
                    method: "POST",
                    body: JSON.stringify(order)
                });
            },
            removeOrder(userId, orderId) {
                return request(`/api/users/${userId}/orders/${orderId}`, {
                    method: "DELETE"
                });
            }
        }
    });
})();
