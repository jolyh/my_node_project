import dbConfig from './dbConfig.js';

const config = Object.freeze({
    // User
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 64,

    // JWT configuration
    JWT_EXPIRATION: '1h', // Token expiration time
    JWT_COOKIE_NAME: 'token', // Name of the cookie to store the JWT

    db : dbConfig
});

export default Object.freeze(config);