import userRoles from "./roles.js";

const User = {
    // Create a new user object with default values
    new: (userData) => {
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
        };
    },
    forCreation: (userData) => {
        return {
            name: userData.name || '',
            email: userData.email || '',
            password: userData.password || '',
            role: userData.role || userRoles.GUEST,
        };
    },
    forUpdate: (userData) => {
        return {
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || userRoles.GUEST,
        };
    },
    /**
     * Removes sensitive information from user data and hides the guest role.
     * @param {Object} userData 
     * @returns {Object} sanitized user data
     */
    sanitize: (userData) => {
        if (!userData) return null;

        if (!userData.role) {
            throw new Error("User role is required for sanitization.");
        }

        if (userData.role < userRoles.SYSTEM) {
            delete userData.password;
        }
        if (userData.role < userRoles.USER) {
            delete userData.role;
        }
        return userData;
    },
    toArray: (userData) => {
        return Object.values(userData);
    }
};

export default User;