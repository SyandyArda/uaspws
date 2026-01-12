const { ApiKey, User } = require('../models');
const ApiResponse = require('../utils/response');

/**
 * Middleware to verify API Key
 */
const apiKeyMiddleware = async (req, res, next) => {
    try {
        // Get API key from header
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            const error = ApiResponse.error(
                'UNAUTHORIZED',
                'API key is required. Please include X-API-Key header',
                null,
                401
            );
            return res.status(401).json(error);
        }

        // Find API key in database
        const keyRecord = await ApiKey.findOne({
            where: { api_key: apiKey, is_active: true },
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password_hash'] }
            }]
        });

        if (!keyRecord) {
            const error = ApiResponse.error(
                'UNAUTHORIZED',
                'Invalid API key',
                null,
                401
            );
            return res.status(401).json(error);
        }

        // Check expiration
        if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
            const error = ApiResponse.error(
                'UNAUTHORIZED',
                'API key has expired',
                null,
                401
            );
            return res.status(401).json(error);
        }

        // Check if user is active
        if (!keyRecord.user.is_active) {
            const error = ApiResponse.error(
                'FORBIDDEN',
                'Account is deactivated',
                null,
                403
            );
            return res.status(403).json(error);
        }

        // Update last used timestamp (async, don't wait)
        keyRecord.update({ last_used_at: new Date() }).catch(err => {
            console.error('Failed to update API key last_used_at:', err);
        });

        // Attach user and API key to request
        req.user = keyRecord.user;
        req.apiKey = keyRecord;
        next();
    } catch (error) {
        console.error('API Key middleware error:', error);
        const response = ApiResponse.error(
            'INTERNAL_ERROR',
            'Failed to validate API key',
            null,
            500
        );
        return res.status(500).json(response);
    }
};

module.exports = apiKeyMiddleware;
