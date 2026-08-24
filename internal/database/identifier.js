const IDENTIFIER_PATTERN = /^[A-Za-z0-9_]+$/;

// Guards against SQL injection via interpolated database/table identifiers, which can't be parameterized.
const assertValidIdentifier = (name, label) => {
    if (typeof name !== 'string' || !IDENTIFIER_PATTERN.test(name)) {
        throw new Error(`Invalid ${label}: "${name}". Only letters, numbers, and underscores are allowed.`);
    }
    return name;
};

export { assertValidIdentifier };
