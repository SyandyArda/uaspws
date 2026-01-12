const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SmartRetail Open API',
            version: '1.0.0',
            description: 'Retail Management as a Service - RESTful API for inventory, transactions, and analytics',
            contact: {
                name: 'Syandy Arda Syahnuari',
                email: 'support@smartretail.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://api.smartretail.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token for dashboard authentication'
                },
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key',
                    description: 'API key for programmatic access'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    example: 'VALIDATION_ERROR'
                                },
                                message: {
                                    type: 'string',
                                    example: 'Invalid input data'
                                },
                                details: {
                                    type: 'object'
                                }
                            }
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                timestamp: {
                                    type: 'string',
                                    format: 'date-time'
                                }
                            }
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        product_id: {
                            type: 'integer',
                            example: 1
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        sku: {
                            type: 'string',
                            example: 'PROD-001'
                        },
                        name: {
                            type: 'string',
                            example: 'Laptop Dell XPS 13'
                        },
                        description: {
                            type: 'string',
                            example: '13-inch ultrabook'
                        },
                        price: {
                            type: 'number',
                            format: 'decimal',
                            example: 15000000
                        },
                        stock: {
                            type: 'integer',
                            example: 10
                        },
                        low_stock_threshold: {
                            type: 'integer',
                            example: 5
                        },
                        image_url: {
                            type: 'string',
                            format: 'uri',
                            example: 'https://example.com/image.jpg'
                        },
                        is_synced: {
                            type: 'boolean',
                            example: true
                        },
                        is_deleted: {
                            type: 'boolean',
                            example: false
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        transaction_id: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        total_price: {
                            type: 'number',
                            format: 'decimal',
                            example: 30000000
                        },
                        payment_method: {
                            type: 'string',
                            enum: ['cash', 'card', 'e-wallet', 'bank_transfer', 'other'],
                            example: 'cash'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'completed', 'cancelled', 'refunded'],
                            example: 'completed'
                        },
                        sync_status: {
                            type: 'string',
                            enum: ['pending', 'synced', 'failed'],
                            example: 'synced'
                        },
                        notes: {
                            type: 'string',
                            example: 'Customer notes'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        category_id: {
                            type: 'integer',
                            example: 1
                        },
                        user_id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Electronics'
                        },
                        description: {
                            type: 'string',
                            example: 'Electronic devices and accessories'
                        },
                        parent_id: {
                            type: 'integer',
                            nullable: true,
                            example: null
                        },
                        image_url: {
                            type: 'string',
                            format: 'uri',
                            example: 'https://example.com/images/electronics.jpg'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            example: 1
                        },
                        per_page: {
                            type: 'integer',
                            example: 20
                        },
                        total: {
                            type: 'integer',
                            example: 100
                        },
                        total_pages: {
                            type: 'integer',
                            example: 5
                        }
                    }
                }
            },
            responses: {
                Unauthorized: {
                    description: 'Unauthorized - Invalid or missing API key',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                RateLimitExceeded: {
                    description: 'Rate limit exceeded',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'System',
                description: 'System health and information'
            },
            {
                name: 'Authentication',
                description: 'User authentication and API key management'
            },
            {
                name: 'Products',
                description: 'Product inventory management'
            },
            {
                name: 'Transactions',
                description: 'Sales transaction processing'
            },
            {
                name: 'Categories',
                description: 'Product category management'
            }
        ],
        paths: {
            '/api/v1/health': {
                get: {
                    tags: ['System'],
                    summary: 'Health check',
                    description: 'Check if the API is running',
                    responses: {
                        200: {
                            description: 'API is healthy'
                        }
                    }
                }
            },
            '/api/v1/version': {
                get: {
                    tags: ['System'],
                    summary: 'API version',
                    description: 'Get API version information',
                    responses: {
                        200: {
                            description: 'Version information'
                        }
                    }
                }
            },
            '/api/v1/auth/register': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Register new user',
                    description: 'Create a new user account',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'username', 'password', 'store_name'],
                                    properties: {
                                        email: { type: 'string', format: 'email' },
                                        username: { type: 'string' },
                                        password: { type: 'string', format: 'password' },
                                        store_name: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User created successfully' },
                        400: { description: 'Validation error' }
                    }
                }
            },
            '/api/v1/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Login',
                    description: 'Login with username and password',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['username', 'password'],
                                    properties: {
                                        username: { type: 'string' },
                                        password: { type: 'string', format: 'password' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login successful' },
                        401: { description: 'Invalid credentials' }
                    }
                }
            },
            '/api/v1/products': {
                get: {
                    tags: ['Products'],
                    summary: 'List products',
                    description: 'Get all products (paginated)',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' },
                            description: 'API Key for authentication'
                        },
                        {
                            name: 'page',
                            in: 'query',
                            schema: { type: 'integer', default: 1 }
                        },
                        {
                            name: 'per_page',
                            in: 'query',
                            schema: { type: 'integer', default: 20 }
                        }
                    ],
                    responses: {
                        200: { description: 'List of products' },
                        401: { description: 'Unauthorized' }
                    }
                },
                post: {
                    tags: ['Products'],
                    summary: 'Create product',
                    description: 'Create a new product',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'price'],
                                    properties: {
                                        name: { type: 'string' },
                                        sku: { type: 'string' },
                                        price: { type: 'number' },
                                        stock: { type: 'integer' },
                                        description: { type: 'string' },
                                        low_stock_threshold: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Product created' },
                        400: { description: 'Validation error' }
                    }
                }
            },
            '/api/v1/products/search': {
                get: {
                    tags: ['Products'],
                    summary: 'Search products',
                    description: 'Search products by name, SKU, or description',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'q',
                            in: 'query',
                            required: true,
                            schema: { type: 'string' },
                            description: 'Search query'
                        }
                    ],
                    responses: {
                        200: { description: 'Search results' }
                    }
                }
            },
            '/api/v1/products/low-stock': {
                get: {
                    tags: ['Products'],
                    summary: 'Low stock products',
                    description: 'Get products with low stock',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Low stock products' }
                    }
                }
            },
            '/api/v1/products/{id}': {
                get: {
                    tags: ['Products'],
                    summary: 'Get product',
                    description: 'Get single product by ID',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    responses: {
                        200: { description: 'Product details' },
                        404: { description: 'Product not found' }
                    }
                },
                put: {
                    tags: ['Products'],
                    summary: 'Update product',
                    description: 'Update product details',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        price: { type: 'number' },
                                        stock: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Product updated' }
                    }
                },
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product',
                    description: 'Soft delete a product',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    responses: {
                        200: { description: 'Product deleted' }
                    }
                }
            },
            '/api/v1/products/{id}/stock': {
                patch: {
                    tags: ['Products'],
                    summary: 'Update stock',
                    description: 'Update product stock quantity',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'integer' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['stock'],
                                    properties: {
                                        stock: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Stock updated' }
                    }
                }
            },
            '/api/v1/transactions': {
                get: {
                    tags: ['Transactions'],
                    summary: 'List transactions',
                    description: 'Get all transactions (paginated)',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'List of transactions' }
                    }
                },
                post: {
                    tags: ['Transactions'],
                    summary: 'Create transaction',
                    description: 'Create a new transaction',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['items'],
                                    properties: {
                                        items: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    product_id: { type: 'integer' },
                                                    quantity: { type: 'integer' }
                                                }
                                            }
                                        },
                                        payment_method: { type: 'string' },
                                        notes: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Transaction created' }
                    }
                }
            },
            '/api/v1/transactions/daily-summary': {
                get: {
                    tags: ['Transactions'],
                    summary: 'Daily summary',
                    description: 'Get daily sales summary',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Daily summary' }
                    }
                }
            },
            '/api/v1/transactions/{id}': {
                get: {
                    tags: ['Transactions'],
                    summary: 'Get transaction',
                    description: 'Get transaction details',
                    security: [{ ApiKeyAuth: [] }],
                    parameters: [
                        {
                            name: 'X-API-Key',
                            in: 'header',
                            required: true,
                            schema: { type: 'string' }
                        },
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        200: { description: 'Transaction details' }
                    }
                }
            }
        }
    },
    apis: [path.join(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
