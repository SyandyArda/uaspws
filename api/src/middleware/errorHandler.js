const ApiResponse = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message,
            value: e.value
        }));

        const response = ApiResponse.error(
            'VALIDATION_ERROR',
            'Database validation failed',
            errors,
            400
        );
        return res.status(400).json(response);
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const field = err.errors[0]?.path || 'unknown';
        const response = ApiResponse.error(
            'DUPLICATE_ENTRY',
            `${field} already exists`,
            { field },
            409
        );
        return res.status(409).json(response);
    }

    // Sequelize foreign key constraint error
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        const response = ApiResponse.error(
            'INVALID_REFERENCE',
            'Referenced resource does not exist',
            null,
            400
        );
        return res.status(400).json(response);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const response = ApiResponse.error(
            'UNAUTHORIZED',
            'Invalid token',
            null,
            401
        );
        return res.status(401).json(response);
    }

    if (err.name === 'TokenExpiredError') {
        const response = ApiResponse.error(
            'UNAUTHORIZED',
            'Token has expired',
            null,
            401
        );
        return res.status(401).json(response);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const response = ApiResponse.error(
        err.code || 'INTERNAL_ERROR',
        err.message || 'An unexpected error occurred',
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
        statusCode
    );

    return res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    const response = ApiResponse.error(
        'NOT_FOUND',
        `Route ${req.method} ${req.path} not found`,
        null,
        404
    );
    return res.status(404).json(response);
};

module.exports = {
    errorHandler,
    notFoundHandler
};
