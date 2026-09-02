const userRoles = {
    SYSTEM: 99, // Hardcoded system admin role, should not be used for regular users
    ADMIN: 3,
    USER: 2,
    GUEST: 1,
    default: function() {
        return this.GUEST;
    },
    toString: function(role) {
        switch (role) {
            case this.SYSTEM:
                return "system";
            case this.ADMIN:
                return "admin";
            case this.USER:
                return "user";
            case this.GUEST:
                return "guest";
            default:
                return "unknown";
        }
    }
};

export default Object.freeze(userRoles);