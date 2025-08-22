// It's a custom error class named `ApiError` that extends JavaScript's built-in `Error` class.
// This allows you to create structured, consistent error objects for your API.

class ApiError extends Error {

    constructor (
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

};

// --- Export ApiError ---

export { ApiError }