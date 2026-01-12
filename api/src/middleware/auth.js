const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');
const ApiResponse = require('../utils/response');

/**
 * Middleware to verify JWT token
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = ApiResponse.error(
                'UNAUTHORIZED',
                'No token provided. Please include Authorization header with Bearer token',
                null,
                401
            );
            return res.status(401).json(error);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get user from database
        const user = await User.findByPk(decoded.user_id, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            const error = ApiResponse.error(
                'UNAUTHORIZED',
                'User not found',
                null,
                401
            );
            return res.status(401).json(error);
        }

        if (!user.is_active) {
            const error = ApiResponse.error(
                'FORBIDDEN',
                'Account is deactivated',
                null,
                403
            );
            return res.status(403).json(error);
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        const response = ApiResponse.error(
            'UNAUTHORIZED',
            error.message || 'Invalid or expired token',
            null,
            401
        );
        return res.status(401).json(response);
    }
};

module.exports = authMiddleware;
