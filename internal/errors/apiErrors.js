const apiErrors = {
    //#region General API Errors
    ENDPOINT_NOT_FOUND: {
        code: 'ENDPOINT_NOT_FOUND',
        status: 404,
        message: 'API endpoint not found'
    },
    INVALID_REQUEST: {
        code: 'INVALID_REQUEST',
        status: 400,
        message: 'The request is invalid or malformed'
    },
    MISSING_REQUIRED_PARAMETER: {
        code: 'MISSING_REQUIRED_PARAMETER',
        status: 400,
        message: 'A required parameter is missing from the request'
    },
    REQUEST_TIMEOUT: {
        code: 'REQUEST_TIMEOUT',
        status: 408,
        message: 'The request took too long to complete. Please try again.'
    },
    UNSUPPORTED_MEDIA_TYPE: {
        code: 'UNSUPPORTED_MEDIA_TYPE',
        status: 415,
        message: 'The media type of the request is not supported'
    },
    RATE_LIMIT_EXCEEDED: {
        code: 'RATE_LIMIT_EXCEEDED',
        status: 429,
        message: 'Rate limit exceeded. Please try again later.'
    },
    //#endregion
    //#region Resource Errors
    RESOURCE_NOT_FOUND: {
        code: 'RESOURCE_NOT_FOUND',
        status: 404,
        message: 'The requested resource could not be found'
    },
    RESOURCE_CONFLICT: {
        code: 'RESOURCE_CONFLICT',
        status: 409,
        message: 'The request could not be completed due to a conflict with the current state of the resource'
    },
    RESOURCE_VALIDATION_FAILED: {
        code: 'RESOURCE_VALIDATION_FAILED',
        status: 422,
        message: 'The resource failed validation checks'
    },
    RESOURCE_MODIFICATION_FAILED: {
        code: 'RESOURCE_MODIFICATION_FAILED',
        status: 500,
        message: 'Failed to modify the requested resource'
    },
    RESOURCE_CREATION_FAILED: {
        code: 'RESOURCE_CREATION_FAILED',
        status: 500,
        message: 'Failed to create the requested resource'
    },
    RESOURCE_UPDATE_FAILED: {
        code: 'RESOURCE_UPDATE_FAILED',
        status: 500,
        message: 'Failed to update the requested resource'
    },
    RESOURCE_DELETION_FAILED: {
        code: 'RESOURCE_DELETION_FAILED',
        status: 500,
        message: 'Failed to delete the requested resource'
    },
    RESOURCE_LOCKED: {
        code: 'RESOURCE_LOCKED',
        status: 423,
        message: 'The resource is locked and cannot be modified'
    },
    //#endregion
};

export default Object.freeze(apiErrors);