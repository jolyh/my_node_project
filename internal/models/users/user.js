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
    sanitize: (userData) => {
        // Remove sensitive fields like password before sending to client
        const { password, ...sanitizedData } = userData;
        if (sanitizedData.role === userRoles.GUEST) {
            delete sanitizedData.role;
        }
        return sanitizedData;
    },
    toArray: (userData) => {
        return Object.values(userData);
    }
};

export default User;