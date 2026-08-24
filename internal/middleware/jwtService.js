import jwt from 'jsonwebtoken' // https://www.npmjs.com/package/jsonwebtoken
import hashUtils from '../utils/hashUtils.js'

const JWT_DEFAULT_EXPIRATION = 3600; // Default expiration time in seconds (1 hour)
const JWT_MAX_EXPIRATION = 86400; // Maximum expiration time in seconds (24 hours)

const signJWT = async (
    userId,
    email,
    role,
    exp = JWT_DEFAULT_EXPIRATION // in seconds, e.g., 3600 for 1 hour
) => {
    
    const key = process.env.JWT_KEY

    return jwt.sign(
        { 
            userId: userId,
            email,
            role
        }, 
        key,
        {
            ...(exp && { expiresIn: exp })
        }
    );
}

const verifyJWT = (token) => {
    const key = process.env.JWT_KEY
    return jwt.verify(token, key)
}

const decodeJWT = (token) => {
    return jwt.decode(token)
}

const compareIdFromToken = async (id, token) => {
    const decoded = decodeJWT(token)
    const hashedId = decoded.userId

    if (!hashedId) return false

    const compareResult = await hashUtils.id.compare(id, hashedId);
    return compareResult
}

const jwtService =  {
    sign: signJWT,
    verify: verifyJWT,
    decode: decodeJWT,
    compareId: compareIdFromToken
}

const jwtUtils = {
    JWT_DEFAULT_EXPIRATION,
    JWT_MAX_EXPIRATION
}

export { jwtService, jwtUtils }