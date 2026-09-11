import { 
    checkExact, 
    param,
    body
} from "express-validator";

import handleValidationError from "#validators/validation.handler";

const validIdParamWithSystem = param('id')
    .exists().withMessage('ID is required')
    .isInt({ min: 0 }).withMessage('ID must be a positive integer'); // 0 for system admin


const validIdParamNoSystem = param('id')
    .exists().withMessage('ID is required')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer');

//#region User 
const getUserValidationRules = [
    validIdParamWithSystem
];

const editUserValidationRules = [
    validIdParamNoSystem,
    body('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('email')
        .optional()
        .isEmail().withMessage('Email must be a valid email address'),
];

const signupValidationRules = [
    body('name')
        .exists().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('password')
        .exists().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email')
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
];

const deleteUserValidationRules = [
    validIdParamNoSystem
];

// #endregion

// #region User orders
const getUserOrdersValidationRules = [
    validIdParamNoSystem,
];

//#endregion

// #region User tasks
const getUserTasksValidationRules = [
    validIdParamWithSystem,
];

//#endregion

const userValidationRules = {
    get: [checkExact(getUserValidationRules), handleValidationError],
    create: [checkExact(signupValidationRules), handleValidationError],
    update: [checkExact(editUserValidationRules), handleValidationError],
    delete: [checkExact(deleteUserValidationRules), handleValidationError],
    getOrders: [checkExact(getUserOrdersValidationRules), handleValidationError],
    getTasks: [checkExact(getUserTasksValidationRules), handleValidationError],
};

export { userValidationRules };