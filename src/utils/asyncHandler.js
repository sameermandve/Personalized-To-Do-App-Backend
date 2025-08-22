// A higher-order function that wraps an asynchronous request handler to catch any errors.
// This avoids the need for repetitive try-catch blocks in your async controller functions.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((error) => next(error));
    }
}

// --- Export asyncHandler ---

export { asyncHandler }