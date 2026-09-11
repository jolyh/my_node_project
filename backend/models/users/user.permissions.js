import userRoles from "#models/users/roles";

const isSystem = (user) => {
    return user && user.role >= userRoles.SYSTEM;
};

const isAdmin = (user) => {
    return user && user.role >= userRoles.ADMIN;
};

const isUser = (user) => {
    return user && user.role >= userRoles.USER;
};

const isEndUser = (user) => {
    return user && user.role >= userRoles.END_USER;
};

const hasHigherRole = (currentUser, targetUser) => {
    if (!currentUser || !targetUser) return false;
    return currentUser.role > targetUser.role;
};

const hasEqualOrHigherRole = (currentUser, targetUser) => {
    if (!currentUser || !targetUser) return false;
    return currentUser.role >= targetUser.role;
};

const isSameUser = (currentUser, targetUser) => {
    if (!currentUser || !targetUser) return false;
    return currentUser.id === targetUser.id;
};

const isInternalUser = (user) => {
    return user && (user.role === userRoles.SYSTEM || user.role === userRoles.ADMIN);
};

const UserPermissions = {
    //#region GET
    canGetSelf: (currentUser, targetUser) => {
        return isSameUser(currentUser, targetUser);
    },

    canGetOther: (currentUser, targetUser) => {
        if (isSameUser(currentUser, targetUser)) return true;
        if (isSystem(currentUser)) return true;
        if (isAdmin(currentUser) && hasEqualOrHigherRole(currentUser, targetUser)) return true;
        return false;
    },

    canGetOthers: (currentUser) => {
        return isInternalUser(currentUser);
    },
    //#endregion


    //#region CREATE
    canCreate: (currentUser) => {
        return isInternalUser(currentUser);
    },
    //#endregion

    //#region UPDATE
    canUpdateSelf: (currentUser, targetUser) => {
        if (isSystem(currentUser)) return false;
        return isSameUser(currentUser, targetUser);
    },
    canUpdateOther: (currentUser, targetUser) => {
        if (isSystem(currentUser)) return true;
        if (isAdmin(currentUser) && hasEqualOrHigherRole(currentUser, targetUser)) return true;
        return false;
    },
    //#endregion

    //#region DELETE
    canDeleteSelf: (currentUser, targetUser) => {
        if (isSystem(currentUser)) return false;
        return isSameUser(currentUser, targetUser);
    },

    canDeleteOther: (currentUser, targetUser) => {
        if (isSystem(currentUser)) return true;
        if (isAdmin(currentUser) && hasHigherRole(currentUser, targetUser)) return true;
        return false;
    },
    //#endregion

};

export default UserPermissions;