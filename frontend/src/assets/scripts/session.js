const token = {
    get() {
        return window.localStorage.getItem("jwtToken");
    },
    set(token) {
        window.localStorage.setItem("jwtToken", token);
    },
    clear() {
        window.localStorage.removeItem("jwtToken");
    },
}

const currentUser = {
    get() {
        const user = window.localStorage.getItem("currentUser");
        const parsedUser = user ? JSON.parse(user) : null;
        console.log('Retrieved current user from localStorage:', parsedUser);
        return parsedUser
    },
    set(user) {
        window.localStorage.setItem("currentUser", JSON.stringify(user));
    },
    clear() {
        window.localStorage.removeItem("currentUser");
    }
};

const session = {
    token : token,
    currentUser : currentUser,
    isAuthenticated() {
        return !!token.get();
    },
    clear() {
        console.log("Clearing session...");
        token.clear();
        currentUser.clear();
    }
};

export default session;