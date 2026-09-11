// import from shared
/**
 * SYSTEM: 99
 * ADMIN: 3
 * USER: 2
 * END_USER: 1 - DEFAULT
 * @enum {number}
 */
const userRoles = {
    SYSTEM: process.env.SYSTEM_USER_ROLE ? parseInt(process.env.SYSTEM_USER_ROLE) : 99,
    ADMIN: 3,
    USER: 2,
    END_USER: 1,
    default: function() {
        return this.END_USER;
    },
     toString: function(role) {
    switch (role) {
      case this.SYSTEM:
        return "system";
      case this.ADMIN:
        return "admin";
      case this.USER:
        return "user";
      case this.END_USER:
        return "end_user";
      default:
        return "unknown";
    }
  }
};

export default Object.freeze(userRoles);