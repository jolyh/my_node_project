const jwtConfig = {
    JWT_MIN_EXPIRATION: 300, // Minimum expiration time in seconds (5 minutes)
    JWT_DEFAULT_EXPIRATION: 3600, // Default expiration time in seconds (1 hour)
    JWT_MAX_EXPIRATION: 86400, // Maximum expiration time in seconds (24 hours)
    JWT_COOKIE_NAME: 'token', // Name of the cookie to store the JWT
};

export default Object.freeze(jwtConfig);