const IDENTIFIER_PATTERN = /^[A-Za-z0-9_]+$/;

// Guards against SQL injection via interpolated database/table identifiers, which can't be parameterized.
const assertValidIdentifier = (name, label) => {
    if (typeof name !== 'string' || !IDENTIFIER_PATTERN.test(name)) {
        throw new Error(`Invalid ${label}: "${name}". Only letters, numbers, and underscores are allowed.`);
    }
    return name;
};

/**
 * Trims and normalizes into single spaces whitespace, carriage return, newline, and tabs in an SQL query.
 * @param {string} query - The SQL query to trim and normalize.
 * @returns {string} - The trimmed and normalized SQL query.
 */
const trimQuery = (query) => {
    return query.replace(/[\r\n\t\s]+/g, " ").trim();
};

export { assertValidIdentifier, trimQuery };
