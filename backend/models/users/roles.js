
/**
 * SYSTEM: 99
 * ADMIN: 3
 * USER: 2
 * GUEST: 1 - DEFAULT
 * @enum {number}
 */
const userRoles = {
    SYSTEM: process.env.SYSTEM_USER_ROLE ? parseInt(process.env.SYSTEM_USER_ROLE) : 99,
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