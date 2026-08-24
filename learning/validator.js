const VALIDATION_ERROR_STATUS = 422; // Unprocessable Entity
const VALIDATION_ERROR_MESSAGE = "Validation failed";
const VALIDATION_TYPE = {
    INPUT: 'INPUT', // For partial validation (e.g., user input)
    OUTPUT: 'OUTPUT' // For full validation (e.g., database output)
};

/**
 * Cleans the input data by removing any properties that are not defined in the schema.
 * For input validation, it retains only editable properties defined in the schema.
 * For output validation, it retains all properties defined in the schema.
 * @param {Object} data - The input/output data to clean.
 * @param {Object} schema - The schema to clean against.
 * @param {string} type - The type of validation (INPUT or OUTPUT).
 * @returns {Object} - The cleaned data.
 */
const cleanDataAgainstSchema = (data, schema, type = VALIDATION_TYPE.INPUT) => {
    const cleanedData = {};
    for (const key in schema) {
        if (data.hasOwnProperty(key)) {
            // For input validation, include only editable fields
            if (type === VALIDATION_TYPE.INPUT && schema[key].editable) {
                cleanedData[key] = data[key];
            }
            // For output validation, include all fields
            if (type === VALIDATION_TYPE.OUTPUT) {
                cleanedData[key] = data[key];
            }
        }
    }
    return cleanedData;
};

const validateDataAgainstSchema = (data, schema, type = VALIDATION_TYPE.INPUT) => {
    const errors = [];

    for (const key in schema) {
        if (
            type === VALIDATION_TYPE.OUTPUT && schema[key].optional === false && !data.hasOwnProperty(key)
            || type === VALIDATION_TYPE.INPUT && schema[key].editable && schema[key].optional === false && !data.hasOwnProperty(key)
        ) {
            errors.push(`Missing field: ${key}`);
        }
        else if (data.hasOwnProperty(key) && typeof data[key] !== schema[key].type) {
            errors.push(`Invalid type for field: ${key}. Expected ${schema[key].type}, got ${typeof data[key]}`);
        } 
        else if (data.hasOwnProperty(key) && schema[key].validate && !schema[key].validate(data[key])) {
            errors.push(`Invalid value for field: ${key}`);
        }
    }
    if (errors.length > 0) {
        console.warn("[WARN] Validation failed for data and schema:", data, schema, "Errors:", errors);
        return errors
    }
    console.log("[INFO] Validation successful for data and schema:", data, schema);
    return errors // Return empty array if no errors
}

export { validateDataAgainstSchema, cleanDataAgainstSchema, VALIDATION_TYPE, VALIDATION_ERROR_STATUS, VALIDATION_ERROR_MESSAGE };