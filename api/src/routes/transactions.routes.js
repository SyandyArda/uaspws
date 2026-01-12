const express = require('express');
const { body, query } = require('express-validator');
const transactionsController = require('../controllers/transactions.controller');
const apiKeyMiddleware = require('../middleware/apiKey');
const validate = require('../middleware/validator');

const router = express.Router();

// All transaction routes require API key authentication
router.use(apiKeyMiddleware);

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: List all transactions
 *     description: Get paginated list of all transactions for authenticated user
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Successful response
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
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       429:
 *         $ref: '#/components/responses/RateLimitExceeded'
 */
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('per_page').optional().isInt({ min: 1, max: 100 }),
    validate
], transactionsController.listTransactions);

/**
 * @swagger
 * /api/v1/transactions/daily-summary:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get daily sales summary
 *     description: Get summary of today's sales including total revenue and transaction count
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Daily summary
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
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: '2026-01-12'
 *                     total_transactions:
 *                       type: integer
 *                       example: 25
 *                     total_revenue:
 *                       type: number
 *                       format: decimal
 *                       example: 5000000
 *                     total_items_sold:
 *                       type: integer
 *                       example: 50
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/daily-summary', transactionsController.getDailySummary);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get single transaction
 *     description: Get detailed information about a specific transaction including items
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Transaction'
 *                     - type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               item_id:
 *                                 type: integer
 *                               product_id:
 *                                 type: integer
 *                               product_name:
 *                                 type: string
 *                               quantity:
 *                                 type: integer
 *                               unit_price:
 *                                 type: number
 *                                 format: decimal
 *                               subtotal:
 *                                 type: number
 *                                 format: decimal
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/:id', transactionsController.getTransaction);

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create new transaction
 *     description: Create a new sales transaction with multiple items. Stock will be automatically deducted.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: Array of products to purchase
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                       description: Product ID
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *                       minimum: 1
 *                       description: Quantity to purchase
 *                     unit_price:
 *                       type: number
 *                       format: decimal
 *                       example: 50000
 *                       description: Unit price (optional, will use product price if not provided)
 *               payment_method:
 *                 type: string
 *                 enum: [cash, card, e-wallet, bank_transfer, other]
 *                 example: cash
 *                 description: Payment method
 *               notes:
 *                 type: string
 *                 example: Customer requested gift wrapping
 *                 description: Additional notes
 *           example:
 *             items:
 *               - product_id: 1
 *                 quantity: 2
 *                 unit_price: 50000
 *               - product_id: 3
 *                 quantity: 1
 *                 unit_price: 100000
 *             payment_method: cash
 *             notes: Regular customer
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Transaction'
 *                     - type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             type: object
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: INSUFFICIENT_STOCK
 *                     message:
 *                       type: string
 *                       example: Insufficient stock for product Laptop Dell XPS 13
 *       404:
 *         description: Product not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', [
    body('items').isArray({ min: 1 }).withMessage('Transaction must have at least one item'),
    body('items.*.product_id').isInt().withMessage('Product ID must be an integer'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('payment_method').optional().isIn(['cash', 'card', 'e-wallet', 'bank_transfer', 'other']),
    body('notes').optional().isString(),
    validate
], transactionsController.createTransaction);

module.exports = router;
