const UserConstraints = {
  id: {
    min: 0
  },
  name: {
    min: 3,
    max: 50
  },
  password: {
    min: 8,
    max: 64
  }
};


//#region User Roles
const userRole = {
  SYSTEM: 99,
  ADMIN: 3,
  USER: 2,
  END_USER: 1,
  default: function () {
    return this.END_USER;
  },
  toString: function (role) {
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
  },
  fromString: function (str) {
    switch (str.toLowerCase()) {
      case "system":
        return this.SYSTEM;
      case "admin":
        return this.ADMIN;
      case "user":
        return this.USER;
      case "end_user":
      case "end user":
        return this.END_USER;
      default:
        return null;
    }
  },
  toLabel: function (role, capitalised = false) {
    switch (role) {
      case this.SYSTEM:
        return capitalised ? "System" : "system";
      case this.ADMIN:
        return capitalised ? "Admin" : "admin";
      case this.USER:
        return capitalised ? "User" : "user";
      case this.END_USER:
        return capitalised ? "End User" : "end user";
      default:
        return capitalised ? "Unknown" : "unknown";
    }
  },
  toLabels : function (roles, capitalised = false) {
    return roles.map(role => this.toLabel(role, capitalised));
  },
  getLowerRoles: function (role) {
    const roles = [];
    if (role > this.END_USER) roles.push(this.END_USER);
    if (role > this.USER) roles.push(this.USER);
    if (role > this.ADMIN) roles.push(this.ADMIN);
    return roles;
  },
  getLowerOrEqualRoles: function (role) {
    const roles = [];
    if (role >= this.END_USER) roles.push(this.END_USER);
    if (role >= this.USER) roles.push(this.USER);
    if (role >= this.ADMIN) roles.push(this.ADMIN);
    return roles;
  },
  getHigherRoles: function (role) {
    const roles = [];
    if (role < this.ADMIN) roles.push(this.ADMIN);
    if (role < this.USER) roles.push(this.USER);
    if (role < this.END_USER) roles.push(this.END_USER);
    return roles;
  },
  getHigherOrEqualRoles: function (role) {
    const roles = [];
    if (role <= this.ADMIN) roles.push(this.ADMIN);
    if (role <= this.USER) roles.push(this.USER);
    if (role <= this.END_USER) roles.push(this.END_USER);
    return roles;
  }
};
//#endregion

export { UserConstraints, userRole };