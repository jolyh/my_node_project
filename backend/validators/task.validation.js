import {
    checkExact,
    param,
    body
} from "express-validator";

import handleValidationError from "#validators/validation.handler";

const validIdParam = param('id')
    .exists().withMessage('ID is required')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer');

//#region Task
const getTaskValidationRules = [
    validIdParam
];

const createTaskValidationRules = [
    body('authorId')
        .exists().withMessage('Author ID is required')
        .isInt({ min: 0 }).withMessage('Author ID must be a positive integer'),
    body('title')
        .exists().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string'),
    body('status')
        .optional()
        .isInt().withMessage('Status must be an integer'),
];

const updateTaskValidationRules = [
    validIdParam,
    body('authorId')
        .optional()
        .isInt({ min: 0 }).withMessage('Author ID must be a positive integer'),
    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('description')
        .optional()
        .isString().withMessage('Description must be a string'),
    body('status')
        .optional()
        .isInt().withMessage('Status must be an integer'),
];

const deleteTaskValidationRules = [
    validIdParam
];
//#endregion

const taskValidationRules = {
    get: [checkExact(getTaskValidationRules), handleValidationError],
    create: [checkExact(createTaskValidationRules), handleValidationError],
    update: [checkExact(updateTaskValidationRules), handleValidationError],
    delete: [checkExact(deleteTaskValidationRules), handleValidationError],
};

export { taskValidationRules };
