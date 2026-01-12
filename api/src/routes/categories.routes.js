const express = require('express');
const { body, query } = require('express-validator');
const categoriesController = require('../controllers/categories.controller');
const apiKeyMiddleware = require('../middleware/apiKey');
const validate = require('../middleware/validator');

const router = express.Router();

// All category routes require API key authentication
router.use(apiKeyMiddleware);

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: List all categories
 *     description: Get all categories with subcategories for authenticated user
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of categories
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
 *                     $ref: '#/components/schemas/Category'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', categoriesController.listCategories);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get single category
 *     description: Get category details with subcategories and product count
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
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
 *                     - $ref: '#/components/schemas/Category'
 *                     - type: object
 *                       properties:
 *                         product_count:
 *                           type: integer
 *                           example: 15
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/:id', categoriesController.getCategory);

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create new category
 *     description: Create a new product category
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 example: Electronic devices and accessories
 *               parent_id:
 *                 type: integer
 *                 example: null
 *                 description: Parent category ID for subcategories
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/images/electronics.jpg
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error or duplicate category name
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/', [
    body('name').notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name must not exceed 100 characters'),
    body('description').optional().isString(),
    body('parent_id').optional().isInt().withMessage('Parent ID must be an integer'),
    body('image_url').optional().isURL().withMessage('Image URL must be valid'),
    validate
], categoriesController.createCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update category
 *     description: Update category details
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Electronics
 *               description:
 *                 type: string
 *                 example: Updated description
 *               parent_id:
 *                 type: integer
 *                 example: null
 *               image_url:
 *                 type: string
 *                 format: uri
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/:id', [
    body('name').optional().notEmpty().withMessage('Category name cannot be empty')
        .isLength({ max: 100 }).withMessage('Category name must not exceed 100 characters'),
    body('description').optional().isString(),
    body('parent_id').optional().isInt().withMessage('Parent ID must be an integer'),
    body('image_url').optional().isURL().withMessage('Image URL must be valid'),
    body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
    validate
], categoriesController.updateCategory);

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete category
 *     description: Delete a category (only if it has no products or subcategories)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                       example: Category deleted successfully
 *                     category_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Category has products or subcategories
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.delete('/:id', categoriesController.deleteCategory);

/**
 * @swagger
 * /api/v1/categories/{id}/products:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category products
 *     description: Get all products in a specific category with pagination
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
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
 *         description: List of products in category
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/:id/products', [
    query('page').optional().isInt({ min: 1 }),
    query('per_page').optional().isInt({ min: 1, max: 100 }),
    validate
], categoriesController.getCategoryProducts);

module.exports = router;
