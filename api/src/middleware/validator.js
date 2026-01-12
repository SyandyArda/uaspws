const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/response');

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));

        const error = ApiResponse.error(
            'VALIDATION_ERROR',
            'Invalid input data',
            formattedErrors,
            400
        );

        return res.status(400).json(error);
    }

    next();
};

module.exports = validate;
