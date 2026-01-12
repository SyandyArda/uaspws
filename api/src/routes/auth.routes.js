const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
 *     description: Create a new user account for merchant/store owner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - store_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: merchant@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: merchant123
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123
 *               store_name:
 *                 type: string
 *                 example: My Retail Store
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         store_name:
 *                           type: string
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').isLength({ min: 3, max: 100 }).withMessage('Username must be 3-100 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('store_name').notEmpty().withMessage('Store name is required'),
    validate
], authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login
 *     description: Authenticate user and get access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: merchant123
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         user_id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         store_name:
 *                           type: string
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                     refresh_token:
 *                       type: string
 *                       description: Refresh token for getting new access token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: New JWT access token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', [
    body('refresh_token').notEmpty().withMessage('Refresh token is required'),
    validate
], authController.refresh);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user profile
 *     description: Get authenticated user's profile information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: merchant123
 *                     email:
 *                       type: string
 *                       example: merchant@example.com
 *                     store_name:
 *                       type: string
 *                       example: My Retail Store
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get('/me', authMiddleware, authController.getProfile);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Update user profile
 *     description: Update authenticated user's profile information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               store_name:
 *                 type: string
 *                 example: Updated Store Name
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     store_name:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', [
    authMiddleware,
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('store_name').optional().notEmpty().withMessage('Store name cannot be empty'),
    validate
], authController.updateProfile);

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Change password
 *     description: Change authenticated user's password
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 format: password
 *                 example: OldPassword123
 *               new_password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewSecurePass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Password changed successfully
 *       400:
 *         description: Validation error or incorrect current password
 *       401:
 *         description: Unauthorized
 */
router.post('/change-password', [
    authMiddleware,
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
    validate
], authController.changePassword);

/**
 * @swagger
 * /api/v1/auth/api-keys:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: List all API keys
 *     description: Get all API keys for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key_id:
 *                         type: integer
 *                       key_name:
 *                         type: string
 *                       api_key:
 *                         type: string
 *                       last_used_at:
 *                         type: string
 *                         format: date-time
 *                       expires_at:
 *                         type: string
 *                         format: date-time
 *                       is_active:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/api-keys', authMiddleware, authController.listApiKeys);

/**
 * @swagger
 * /api/v1/auth/api-keys:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Generate new API key
 *     description: Create a new API key for programmatic access
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key_name:
 *                 type: string
 *                 description: Name for the API key
 *                 example: My Personal API Key
 *               expires_in_days:
 *                 type: integer
 *                 description: Number of days until expiration (optional)
 *                 example: 365
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     key_id:
 *                       type: integer
 *                     api_key:
 *                       type: string
 *                       example: sr_live_abc123...
 *                     key_name:
 *                       type: string
 *                     expires_at:
 *                       type: string
 *                       format: date-time
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/api-keys', [
    authMiddleware,
    body('key_name').optional().isString(),
    body('expires_in_days').optional().isInt({ min: 1 }).withMessage('Expiration must be at least 1 day'),
    validate
], authController.generateApiKey);

/**
 * @swagger
 * /api/v1/auth/api-keys/{keyId}:
 *   delete:
 *     tags:
 *       - Authentication
 *     summary: Revoke API key
 *     description: Deactivate an API key
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: keyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: API key revoked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: API key not found
 */
router.delete('/api-keys/:keyId', authMiddleware, authController.revokeApiKey);

module.exports = router;
