import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

const hashId = async (id) => {
    const saltRounds = 10;
    const hashedId = await bcrypt.hash(id.toString(), saltRounds);
    return hashedId;
}
const compareId = async (id, hashedId) => {
    const isMatch = await bcrypt.compare(id.toString(), hashedId);
    return isMatch;
}

const hashUtils = {
    password: {
        hash: hashPassword,
        compare: comparePassword
    },
    id: {
        hash: hashId,
        compare: compareId
    }
}

export default hashUtils;