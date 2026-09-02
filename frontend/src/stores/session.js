import userRoles from './userRoles.js';
import { reactive } from 'vue';

const state = reactive({
    token: window.localStorage.getItem("jwtToken"),
    user: JSON.parse(window.localStorage.getItem("currentUser") || "null")
});

const token = {
    get() {
        return state.token;
    },
    set(token) {
        window.localStorage.setItem("jwtToken", token);
        state.token = token;
    },
    clear() {
        window.localStorage.removeItem("jwtToken");
        state.token = null;
    },
}

const currentUser = {
    get() {
        return state.user;
    },

    // Utils
    isEndUser() {
        const user = currentUser.get();
        return user && user.role === userRoles.USER;
    },
    isAdmin() {
        const user = currentUser.get();
        return user && user.role === userRoles.ADMIN;
    },
    isSystemAdmin() {
        const user = currentUser.get();
        return user && user.role === userRoles.SYSTEM;
    },
    // Session
    set(user) {
        window.localStorage.setItem("currentUser", JSON.stringify(user));
        state.user = user;
    },
    clear() {
        window.localStorage.removeItem("currentUser");
        state.user = null;
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