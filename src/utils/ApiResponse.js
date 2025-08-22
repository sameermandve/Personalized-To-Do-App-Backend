// It's a custom response class named `ApiResponse`
// This allows you to create structured, consistent response objects for your API.

class ApiResponse {

    constructor(
        statusCode,
        data,
        message = "Success",
    ) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }

};

// --- Export ApiResponse ---

export { ApiResponse }