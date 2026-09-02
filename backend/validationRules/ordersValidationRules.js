import { 
    checkExact, 
    param,
    body
} from "express-validator";

import handleValidationError from "./handleValidationError.js";

const validIdParam = param('id')
    .exists().withMessage('ID is required')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer');

//#region Order
const getOrderValidationRules = [
    validIdParam
];

const deleteOrderValidationRules = [
    validIdParam
];

//#endregion

const orderValidationRules = {
    get: [checkExact(getOrderValidationRules), handleValidationError],
    delete: [checkExact(deleteOrderValidationRules), handleValidationError],
};

export { orderValidationRules };