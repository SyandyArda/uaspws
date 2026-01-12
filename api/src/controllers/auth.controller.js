const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, ApiKey } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const ApiResponse = require('../utils/response');

/**
 * Register new user/merchant
 */
const register = async (req, res, next) => {
    try {
        const { email, username, password, store_name } = req.body;

        // Hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            email,
            username,
            password_hash,
            store_name,
            role: 'admin'
        });

        // Generate tokens
        const accessToken = generateAccessToken({ user_id: user.user_id, email: user.email });
        const refreshToken = generateRefreshToken({ user_id: user.user_id });

        const response = ApiResponse.success({
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                store_name: user.store_name,
                role: user.role
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: '15m'
            }
        });

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });

        if (!user) {
            const error = ApiResponse.error(
                'INVALID_CREDENTIALS',
                'Invalid username or password',
                null,
                401
            );
            return res.status(401).json(error);
        }

        // Check if active
        if (!user.is_active) {
            const error = ApiResponse.error(
                'ACCOUNT_DEACTIVATED',
                'Your account has been deactivated',
                null,
                403
            );
            return res.status(403).json(error);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            const error = ApiResponse.error(
                'INVALID_CREDENTIALS',
                'Invalid username or password',
                null,
                401
            );
            return res.status(401).json(error);
        }

        // Generate tokens
        const accessToken = generateAccessToken({ user_id: user.user_id, email: user.email });
        const refreshToken = generateRefreshToken({ user_id: user.user_id });

        const response = ApiResponse.success({
            user: {
                user_id: user.user_id,
                email: user.email,
                username: user.username,
                store_name: user.store_name,
                role: user.role
            },
            tokens: {
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: 'Bearer',
                expires_in: '15m'
            }
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 */
const refresh = async (req, res, next) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            const error = ApiResponse.error(
                'MISSING_REFRESH_TOKEN',
                'Refresh token is required',
                null,
                400
            );
            return res.status(400).json(error);
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refresh_token);

        // Generate new access token
        const accessToken = generateAccessToken({
            user_id: decoded.user_id,
            email: decoded.email
        });

        const response = ApiResponse.success({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: '15m'
        });

        res.json(response);
    } catch (error) {
        const response = ApiResponse.error(
            'INVALID_REFRESH_TOKEN',
            'Invalid or expired refresh token',
            null,
            401
        );
        return res.status(401).json(response);
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
    try {
        const response = ApiResponse.success({
            user_id: req.user.user_id,
            email: req.user.email,
            username: req.user.username,
            store_name: req.user.store_name,
            role: req.user.role,
            is_active: req.user.is_active,
            created_at: req.user.created_at
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
    try {
        const { email, store_name } = req.body;

        await req.user.update({
            ...(email && { email }),
            ...(store_name && { store_name })
        });

        const response = ApiResponse.success({
            user_id: req.user.user_id,
            email: req.user.email,
            username: req.user.username,
            store_name: req.user.store_name
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
    try {
        const { current_password, new_password } = req.body;

        // Verify current password
        const isPasswordValid = await bcrypt.compare(current_password, req.user.password_hash);

        if (!isPasswordValid) {
            const error = ApiResponse.error(
                'INVALID_PASSWORD',
                'Current password is incorrect',
                null,
                400
            );
            return res.status(400).json(error);
        }

        // Hash new password
        const password_hash = await bcrypt.hash(new_password, 12);

        // Update password
        await req.user.update({ password_hash });

        const response = ApiResponse.success({
            message: 'Password changed successfully'
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * List API keys
 */
const listApiKeys = async (req, res, next) => {
    try {
        const apiKeys = await ApiKey.findAll({
            where: { user_id: req.user.user_id },
            attributes: ['key_id', 'key_name', 'api_key', 'last_used_at', 'expires_at', 'is_active', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        const response = ApiResponse.success(apiKeys);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Generate new API key
 */
const generateApiKey = async (req, res, next) => {
    try {
        const { key_name, expires_in_days } = req.body;

        // Generate random API key
        const prefix = process.env.API_KEY_PREFIX || 'sr_live_';
        const randomKey = crypto.randomBytes(32).toString('hex');
        const api_key = prefix + randomKey;

        // Calculate expiration date
        let expires_at = null;
        if (expires_in_days) {
            expires_at = new Date();
            expires_at.setDate(expires_at.getDate() + expires_in_days);
        }

        // Create API key
        const apiKey = await ApiKey.create({
            user_id: req.user.user_id,
            api_key,
            key_name: key_name || 'Default Key',
            expires_at
        });

        const response = ApiResponse.success({
            key_id: apiKey.key_id,
            api_key: apiKey.api_key,
            key_name: apiKey.key_name,
            expires_at: apiKey.expires_at,
            created_at: apiKey.created_at
        });

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Revoke API key
 */
const revokeApiKey = async (req, res, next) => {
    try {
        const { keyId } = req.params;

        const apiKey = await ApiKey.findOne({
            where: {
                key_id: keyId,
                user_id: req.user.user_id
            }
        });

        if (!apiKey) {
            const error = ApiResponse.error(
                'NOT_FOUND',
                'API key not found',
                null,
                404
            );
            return res.status(404).json(error);
        }

        await apiKey.update({ is_active: false });

        const response = ApiResponse.success({
            message: 'API key revoked successfully'
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    getProfile,
    updateProfile,
    changePassword,
    listApiKeys,
    generateApiKey,
    revokeApiKey
};
