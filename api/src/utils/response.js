/**
 * Standard API response format
 */
class ApiResponse {
    static success(data, meta = {}) {
        return {
            success: true,
            data,
            meta: {
                timestamp: new Date().toISOString(),
                ...meta
            }
        };
    }

    static error(code, message, details = null, statusCode = 400) {
        return {
            success: false,
            error: {
                code,
                message,
                ...(details && { details })
            },
            meta: {
                timestamp: new Date().toISOString()
            },
            statusCode
        };
    }

    static paginated(data, pagination) {
        return {
            success: true,
            data,
            pagination: {
                page: pagination.page,
                per_page: pagination.perPage,
                total: pagination.total,
                total_pages: Math.ceil(pagination.total / pagination.perPage)
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        };
    }
}

module.exports = ApiResponse;
