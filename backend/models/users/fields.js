import userRoles from "#models/users/roles";

// Permission -> [editSelf, editOther, visibleSelf, visibleOther]
// This object defines the minimum role required to edit or view each field
/**
 * @type {Object.<string, {query: string, type: string, permissions: [number, number, number, number]}>}
 */
const userFields = {
    id: {
        type: 'number',
        permissions: [userRoles.SYSTEM, userRoles.SYSTEM, userRoles.END_USER, userRoles.END_USER],
        unique: true,
        min: 0, // system should be 0
        max: 9999999999
    },
    name: {
        type: 'string',
        permissions: [userRoles.END_USER, userRoles.USER, userRoles.END_USER, userRoles.END_USER]
    },
    email: {
        type: 'string',
        permissions: [userRoles.END_USER, userRoles.ADMIN, userRoles.END_USER, userRoles.USER]
    },
    password: {
        type: 'string',
        permissions: [userRoles.END_USER, userRoles.SYSTEM, userRoles.END_USER, userRoles.ADMIN]
    },
    role: {
        type: 'number',
        permissions: [userRoles.ADMIN, userRoles.USER, userRoles.END_USER, userRoles.USER]
    },
    created_at: {
        type: 'string',
        permissions: [userRoles.SYSTEM, userRoles.SYSTEM, userRoles.END_USER, userRoles.USER]
    },
    updated_at: {
        type: 'string',
        permissions: [userRoles.SYSTEM, userRoles.SYSTEM, userRoles.END_USER, userRoles.USER]
    }
};

/**
 * Returns true if the user role has permission to edit the specified field, false otherwise.
 * @param {number} userRole 
 * @param {string} fieldKey 
 * @returns {boolean}
 */
const canEditSelfField = (userRole, fieldKey) => {
    return userFields[fieldKey].permissions[0] === userRole || false;
};

/**
 * Returns true if the user role has permission to edit the specified field of another user, false otherwise.
 * @param {number} editorRole
 * @param {string} fieldKey
 * @returns {boolean}
 */
const canEditOtherUserField = (editorRole, fieldKey) => {
    return userFields[fieldKey].permissions[1] <= editorRole;
};

/**
 * Returns true if the user role has permission to view the specified field of their own user data, false otherwise.
 * @param {number} userRole
 * @param {string} fieldKey
 * @returns {boolean}
 */
const canViewSelfField = (userRole, fieldKey) => {
    return userFields[fieldKey].permissions[2] === userRole || false;
}

/**
 * Returns true if the user role has permission to view the specified field of another user's data, false otherwise.
 * @param {number} viewerRole
 * @param {string} fieldKey
 * @returns {boolean}
 */
const canViewOtherUserField = (viewerRole, fieldKey) => {
    return userFields[fieldKey].permissions[3] <= viewerRole;
}

export { userFields, canEditSelfField, canEditOtherUserField, canViewSelfField, canViewOtherUserField };