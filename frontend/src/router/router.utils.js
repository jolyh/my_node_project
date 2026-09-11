// Router metadata
// meta: {
//  requiresAuth: true/false            // indicates if the route requires authentication
//  requiresRoles: userRoles.<roleName> //indicates the minimum roles required to access the route
//  orRequiresSameId: true/false        // indicates if the route requires the same ID as the authenticated user - Override Role

//  showInHeader: true/false            // indicates if the route should be shown in the header - not used for routing
// }

const canAccessLoggedInPages = (currentUser, isAuthenticated) => {
    return currentUser && isAuthenticated;
};

const canAccessRole = (currentUser, requiredRole) => {
    return currentUser && currentUser.role >= requiredRole;
};

const canAccessSameId = (currentUser, id) => {
    return currentUser && String(currentUser.id) === String(id);
};

const shouldRedirect = (route, currentUser, isAuthenticated) => {

    console.log("Should redirect for route:", route, "with currentUser:", currentUser);

    if (route.meta?.requiresAuth && !canAccessLoggedInPages(currentUser, isAuthenticated)) {
        console.log('You are not authenticated; redirecting to login page.');
        return { name: 'Login' }
    }
    if (route.meta?.requiresRole && !canAccessRole(currentUser, route.meta.requiresRole)
        || route.meta?.orRequiresSameId && !canAccessSameId(currentUser, route.params?.id)
    ) {
        console.log('You do not have access to this page; redirecting to home page.');
        return { name: 'Home' }
    }
    
    return true;
};

export { shouldRedirect }