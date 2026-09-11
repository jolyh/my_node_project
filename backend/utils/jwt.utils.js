import jwt from 'jsonwebtoken' // https://www.npmjs.com/package/jsonwebtoken
import hashUtils from '#utils/hash.utils'
import jwtConfig from '#configs/jwt.config'

const signJwt = async (
    data,
    exp = jwtConfig.JWT_DEFAULT_EXPIRATION // in seconds, e.g., 3600 for 1 hour
) => {
    const key = process.env.JWT_KEY
    const expireAt = Math.floor(Date.now() / 1000) + exp;

    return {
        token: jwt.sign(
            data,
            key,
            { ...(exp && { expiresIn: exp }) }
        ),
        expireAt
    };
}

const verifyJwt = (token) => {
    const key = process.env.JWT_KEY
    return jwt.verify(token, key)
}

const decodeJwt = (token) => {
    return jwt.decode(token)
}

const refreshJwt = async (token) => {
    if (!token) {
        return null;
    }
    try {
        const oldJwt = decodeJwt(token);
        const newToken = await signJwt(oldJwt);
        return newToken;
    } catch (err) {
        return null;
    }
}

const compareIdFromToken = async (id, token) => {
    const decoded = decodeJwt(token)
    const hashedId = decoded.userId

    if (!hashedId) return false

    const compareResult = await hashUtils.id.compare(id, hashedId);
    return compareResult
}

const jwtUtils = {
    sign: signJwt,
    verify: verifyJwt,
    decode: decodeJwt,
    refresh: refreshJwt,
    compareId: compareIdFromToken
}

export { jwtUtils }