const express = require('express');
const { body, query } = require('express-validator');
const productsController = require('../controllers/products.controller');
const apiKeyMiddleware = require('../middleware/apiKey');
const validate = require('../middleware/validator');

const router = express.Router();

// All product routes require API key authentication
router.use(apiKeyMiddleware);

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List all products
 *     description: Get paginated list of all products for authenticated user
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
 *                     $ref: '#/components/schemas/Product'
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
], productsController.listProducts);

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Search products
 *     description: Search products by name, SKU, or description
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: laptop
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Search results
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
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Missing search query
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/search', [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }),
    query('per_page').optional().isInt({ min: 1, max: 100 }),
    validate
], productsController.searchProducts);

/**
 * @swagger
 * /api/v1/products/low-stock:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get low stock products
 *     description: Get products where stock is at or below low_stock_threshold
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Low stock products
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
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/low-stock', productsController.getLowStock);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get single product
 *     description: Get detailed information about a specific product
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/:id', productsController.getProduct);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create new product
 *     description: Add a new product to inventory
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Dell XPS 13
 *                 maxLength: 255
 *               sku:
 *                 type: string
 *                 example: DELL-XPS13-001
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 example: 13-inch ultrabook with Intel i7
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 15000000
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 example: 10
 *                 minimum: 0
 *                 default: 0
 *               low_stock_threshold:
 *                 type: integer
 *                 example: 5
 *                 minimum: 0
 *                 default: 10
 *               category_id:
 *                 type: integer
 *                 example: 1
 *                 description: Category ID (optional)
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/images/laptop.jpg
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or duplicate SKU
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sku').optional().isString(),
    body('description').optional().isString(),
    body('low_stock_threshold').optional().isInt({ min: 0 }),
    body('image_url').optional().isURL(),
    validate
], productsController.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product
 *     description: Update product details
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               sku:
 *                 type: string
 *                 example: UPDATED-SKU-001
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               low_stock_threshold:
 *                 type: integer
 *                 minimum: 0
 *               category_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/:id', [
    body('name').optional().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('sku').optional().isString(),
    body('description').optional().isString(),
    body('low_stock_threshold').optional().isInt({ min: 0 }),
    body('image_url').optional().isURL(),
    validate
], productsController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}/stock:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update stock only
 *     description: Update product stock quantity without changing other fields
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 50
 *                 minimum: 0
 *                 description: New stock quantity
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch('/:id/stock', [
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    validate
], productsController.updateStock);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product
 *     description: Soft delete a product (sets is_deleted flag)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                       example: Product deleted successfully
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
