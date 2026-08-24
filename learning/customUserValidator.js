import { 
    validateText,
    validateEmail, 
    validateId 
} from "../utils/validationUtils.js";

import { 
    validateDataAgainstSchema, 
    cleanDataAgainstSchema, 
    VALIDATION_TYPE 
} from "../utils/validator.js";

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const validateName = (name) => validateText(name, MIN_NAME_LENGTH, MAX_NAME_LENGTH);

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 100;
const validatePassword = (password) => validateText(password, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH);

//#region User Validation Schema
/**
 * Full User validation schema for both input and output validation.
 * Defines the expected structure and validation rules for user data.
 * - id: number, required for output, not editable for input
 * - name: string, optional for input, editable, required for output
 * - email: string, required for both input and output, editable
 * - password: string, required for both input and output, editable
 * - createdAt: number (timestamp), required for output, not editable for input
 */
const userSchema = {
    id: {
        type: 'number',
        editable: false, // Input only, not required for output
        optional: false, // Output only, not required for input
        validate: (id) => validateId(id)
    },
    name: { 
        type: 'string', 
        editable: true,
        optional: true, // User can be created without a name, but if provided, it must be valid
        validate: (name) => validateName(name)
    },
    email: { 
        type: 'string', 
        editable: true,
        optional: false, // User must provide email for creation, required for output
        validate: (email) => validateEmail(email)
    },
    password: { 
        type: 'string', 
        editable: true,
        optional: false, // User must provide password for creation, required for output
        validate: (password) => validatePassword(password)
    },
    createdAt: {
        type: 'number',
        editable: false, // Set on creation at Service level
        optional: false, // User must have a createdAt timestamp for output, set at creation
        validate: (createdAt) => typeof createdAt === 'number' && createdAt > 0
    }
};

// Value for Creation and Update
const userInputValidationSchema = {
    name: userSchema.name,
    email: userSchema.email,
    password: userSchema.password
};
//#endregion

//#region User Validation Functions

/**
 * Validates user input data against the user input validation schema.
 * Data should be cleaned before validation to ensure only relevant fields are checked.
 * Returns true if validation passes, false otherwise.
 * @param {Object} data - The user input data to validate.
 */
function validateUserInput(data) {
    const errors = validateDataAgainstSchema(data, userInputValidationSchema, VALIDATION_TYPE.INPUT);
    if (errors.length > 0) {
        return false; // Return false if validation fails
    }
    return true; // Return true if validation passes
}

/** Validates user output data against the full user validation schema.
 * Data should be cleaned before validation to ensure only relevant fields are checked.
 * Returns true if validation passes, false otherwise.
 * @param {Object} user - The user output data to validate.
 */
function validateUserOutput(user) {
    const errors = validateDataAgainstSchema(user, userSchema, VALIDATION_TYPE.OUTPUT);
    if (errors.length > 0) {
        return false; // Return false if validation fails
    }
    return true; // Return true if validation passes
}

//#endregion


function inputUserCleaner(data) {
    return cleanDataAgainstSchema(data, userInputValidationSchema);
}

function outputUserCleaner(data) {
    return cleanDataAgainstSchema(data, userSchema, VALIDATION_TYPE.OUTPUT);
}

const userValidation = {
    cleanInput: inputUserCleaner,
    cleanOutput: outputUserCleaner,
    validateInput: validateUserInput,
    validateOutput: validateUserOutput
};

export { userValidation };