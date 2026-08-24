const validateId = (id) => typeof id === 'number' && Number.isInteger(id) && id >= 0;

const validateText = (text, minLength = 1, maxLength = Infinity) => {
    const length = text ? text.trim().length : 0;
    return text && typeof text === 'string' && length >= minLength && length <= maxLength;
}

const validateTimestamp = (timestamp) => typeof timestamp === 'number' && timestamp > 0;

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateText(email) && emailRegex.test(email);
}

export { 
    validateId, 
    validateText, 
    validateEmail, 
    validateTimestamp
};